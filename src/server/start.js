'use strict';


const { resolve } = require('path');

const { processErrorHandler } = require('./process');
const { processOptions } = require('../options');
const { getIdl } = require('../idl');
const { makeImmutable, assignObject } = require('../utilities');
const { getMiddleware } = require('./middleware');
const { getServerState } = require('./state');
const protocolStartServer = require('./protocols');
const { setupGracefulExit } = require('./exit');
const { handleStartupError } = require('./startup_error');


// Used e.g. to shorten stack traces
global.apiEngineDirName = resolve(__dirname, '../..');

/**
 * Start server for each protocol
 *
 * @param {object} options
 * @param {object} options.idl - IDL definitions
 */
const startServer = function (options = {}) {
  const serverState = getServerState({ options });

  start(options, serverState)
  .catch(error => handleStartupError(error, serverState));

  return serverState.apiServer;
};

const start = async function (options, serverState) {
  const { startupLog, apiServer } = serverState;
  const allPerf = startupLog.perf.start('all', 'all');
  const perf = startupLog.perf.start('main');

  apiServer.options = options;

  serverState.processLog = processErrorHandler({
    serverOpts: options,
    serverState,
  });

  perf.stop();

  const serverOpts = await processOptions({ options, serverState });
  const idl = await getIdl({ serverOpts, serverState });

  // Those two callbacks must be called by each server
  serverState.handleRequest = await getMiddleware({
    serverOpts,
    serverState,
    idl,
  });
  serverState.handleListening = handleListening.bind(null, serverState);
  makeImmutable(serverState);

  const servers = await startAllServers({ serverState });
  apiServer.servers = servers;

  perf.start();

  setupGracefulExit({ servers, serverOpts, serverState });

  await apiServer.emitAsync('start');
  // Create log message when all protocol-specific servers have started
  startupLog.log('Server is ready', { type: 'start' });

  perf.stop();
  allPerf.stop();
  await startupLog.perf.report();
};

// Create log message when each protocol-specific server starts
const handleListening = function ({ startupLog }, { protocol, host, port }) {
  const message = `${protocol.toUpperCase()} - Listening on ${host}:${port}`;
  startupLog.log(message);
};

// Start each server
const startAllServers = async function ({
  serverState,
  serverState: { startupLog },
}) {
  const serversPerf = startupLog.perf.start('servers');

  const protocols = Object.keys(protocolStartServer);
  const serversPromises = protocols.map(async protocol => {
    return await startSingleServer({ protocol, serverState });
  });

  // Make sure all servers are starting concurrently, not serially
  const serversArray = await Promise.all(serversPromises);
  // From [server, ...] to { protocol: server }
  const serversObj = serversArray
    .map((server, index) => ({ [protocols[index]]: server }))
    .reduce(assignObject, {});

  serversPerf.stop();
  return serversObj;
};

const startSingleServer = async function ({
  protocol,
  serverState,
  serverState: { startupLog },
}) {
  const perf = startupLog.perf.start(protocol, 'server');
  const server = await protocolStartServer[protocol].startServer({
    serverState,
  });
  perf.stop();
  return server;
};


module.exports = {
  startServer,
};
