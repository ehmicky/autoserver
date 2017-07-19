'use strict';

const { processOptions } = require('../options');
const { getIdl } = require('../idl');
const { makeImmutable, assignObject } = require('../utilities');
const { protocols, protocolHandlers } = require('../protocols');
const { Log } = require('../logging');
const { getMiddleware } = require('../middleware');

const { processErrorHandler } = require('./process');
const { ApiEngineServer } = require('./api_server');
const { setupGracefulExit } = require('./exit');
const { handleStartupError } = require('./startup_error');

/**
 * Start server for each protocol
 *
 * @param {object} options
 * @param {object} options.idl - IDL definitions
 */
const startServer = function (options = {}) {
  const apiServer = new ApiEngineServer({ serverOpts: options });
  const startupLog = new Log({
    serverOpts: options,
    apiServer,
    phase: 'startup',
  });

  start({ options, startupLog, apiServer })
    .catch(error => handleStartupError({ error, startupLog, apiServer }));

  return apiServer;
};

const start = async function ({ options, startupLog, apiServer }) {
  const allPerf = startupLog.perf.start('all', 'all');
  const perf = startupLog.perf.start('main');

  const processLog = processErrorHandler({
    serverOpts: options,
    apiServer,
  });

  perf.stop();

  const serverOpts = processOptions({ options, startupLog });
  const idl = await getIdl({ serverOpts, startupLog });

  const servers = await startAllServers({
    idl,
    apiServer,
    startupLog,
    processLog,
    serverOpts,
  });
  Object.assign(apiServer, { options, servers });
  makeImmutable(apiServer);

  perf.start();

  setupGracefulExit({ servers, serverOpts, apiServer });

  await apiServer.emitAsync('start');
  // Create log message when all protocol-specific servers have started
  startupLog.log('Server is ready', { type: 'start' });

  perf.stop();
  allPerf.stop();
  await startupLog.perf.report();
};

// Start each server
const startAllServers = async function ({
  idl,
  apiServer,
  startupLog,
  processLog,
  serverOpts,
}) {
  const serversPerf = startupLog.perf.start('servers');

  // This callback must be called by each server
  const requestHandler = await getMiddleware();

  const serversPromises = protocols
    // Can use serverOpts.PROTOCOL.enabled {boolean}
    .filter(protocol => serverOpts[protocol.toLowerCase()].enabled)
    .map(protocol => startSingleServer({
      protocol,
      idl,
      apiServer,
      startupLog,
      processLog,
      serverOpts,
      requestHandler,
    }));

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
  idl,
  apiServer,
  startupLog,
  processLog,
  serverOpts,
  requestHandler,
}) {
  const perf = startupLog.perf.start(protocol, 'server');

  const protocolHandler = protocolHandlers[protocol];
  const opts = serverOpts[protocol.toLowerCase()];
  const handleRequest = (...args) => requestHandler(
    { protocol, idl, apiServer, serverOpts },
    ...args,
  );
  const handleListening = getHandleListening.bind(null, {
    startupLog,
    protocol,
  });

  const server = await protocolHandler.startServer({
    opts,
    processLog,
    handleRequest,
    handleListening,
  });

  perf.stop();
  return server;
};

// Create log message when each protocol-specific server starts
// Also add `apiServer.servers.PROTOCOL.protocol|host|port`
const getHandleListening = function (
  { startupLog, protocol },
  { server, host, port },
) {
  Object.assign(server, { protocol, host, port });
  const message = `${protocol.toUpperCase()} - Listening on ${host}:${port}`;
  startupLog.log(message);
};

module.exports = {
  startServer,
};
