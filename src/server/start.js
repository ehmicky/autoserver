'use strict';


const { resolve } = require('path');
const { cloneDeep } = require('lodash');

const { Log } = require('../logging');
const { processErrorHandler } = require('./process');
const { processOptions } = require('../options');
const { getIdl } = require('../idl');
const { assignObject } = require('../utilities');
const { ApiEngineServer } = require('./api_server');
const { getMiddleware } = require('./middleware');
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
  const apiServer = new ApiEngineServer();
  const startupLog = new Log({ serverOpts: options, phase: 'startup' });

  start(options, apiServer, startupLog)
  .catch(error => handleStartupError(startupLog, apiServer, error));

  return apiServer;
};

const start = async function (options, apiServer, startupLog) {
  const allPerf = startupLog.perf.start('all', 'all');
  const perf = startupLog.perf.start('main');

  const serverOpts = cloneDeep(options);

  const processLog = processErrorHandler({ serverOpts });
  // Assign them to `options` so they are easily available anywhere
  Object.assign(serverOpts, { apiServer, startupLog, processLog });

  perf.stop();

  serverOpts = await processOptions({ serverOpts });
  const idl = await getIdl({ serverOpts });

  // Those two callbacks must be called by each server
  serverOpts.handleRequest = await getMiddleware({ serverOpts, idl });

  serverOpts.handleListening = handleListening.bind(null, startupLog);

  const servers = await startAllServers({ serverOpts, startupLog });

  perf.start();

  Object.assign(apiServer, { servers, options });

  setupGracefulExit({ servers, serverOpts });

  await apiServer.emitAsync('start');
  // Create log message when all protocol-specific servers have started
  startupLog.log('Server is ready', { type: 'start' });

  perf.stop();
  allPerf.stop();
  await startupLog.perf.report();
};

// Create log message when each protocol-specific server starts
const handleListening = function (startupLog, { protocol, host, port }) {
  const message = `${protocol.toUpperCase()} - Listening on ${host}:${port}`;
  startupLog.log(message);
};

// Start each server
const startAllServers = async function ({ serverOpts, startupLog }) {
  const serversPerf = startupLog.perf.start('servers');

  const protocols = Object.keys(protocolStartServer);
  const serversPromises = protocols.map(async protocol => {
    return await startSingleServer({ protocol, serverOpts, startupLog });
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
  serverOpts,
  startupLog,
}) {
  const perf = startupLog.perf.start(protocol, 'server');
  const server = await protocolStartServer[protocol].startServer({
    serverOpts,
  });
  perf.stop();
  return server;
};


module.exports = {
  startServer,
};
