'use strict';


const { processErrorHandler } = require('./process');
const { processOptions } = require('../options');
const { getIdl } = require('../idl');
const { makeImmutable, assignObject } = require('../utilities');
const { protocols, protocolHandlers } = require('../protocols');
const { getMiddleware } = require('./middleware');
const { getServerState } = require('./state');
const { setupGracefulExit } = require('./exit');
const { handleStartupError } = require('./startup_error');


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

  serverState.processLog = processErrorHandler({
    serverOpts: options,
    apiServer,
  });
  makeImmutable(serverState);

  perf.stop();

  const serverOpts = await processOptions({ options, serverState });
  const idl = await getIdl({ serverOpts, serverState });

  // This callback must be called by each server
  const requestHandler = await getMiddleware({ serverOpts, serverState, idl });

  const servers = await startAllServers({
    idl,
    serverState,
    serverOpts,
    requestHandler,
  });
  Object.assign(apiServer, { options, servers });

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
  serverState,
  serverState: { startupLog },
  serverOpts,
  requestHandler,
}) {
  const serversPerf = startupLog.perf.start('servers');

  const serversPromises = protocols
    // Can use serverOpts.PROTOCOL.enabled {boolean}
    .filter(protocol => serverOpts[protocol.toLowerCase()].enabled)
    .map(async protocol =>
      await startSingleServer({
        protocol,
        idl,
        serverState,
        serverOpts,
        requestHandler,
      })
    );

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
  serverState: { apiServer, startupLog, processLog },
  serverOpts,
  requestHandler,
}) {
  const perf = startupLog.perf.start(protocol, 'server');

  const protocolHandler = protocolHandlers[protocol];
  const opts = serverOpts[protocol.toLowerCase()];
  const handleRequest = requestHandler.bind(
    null,
    protocol,
    idl,
    apiServer,
    serverOpts,
  );
  const handleListening = getHandleListening.bind(null, startupLog, protocol);

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
  startupLog,
  protocol,
  { server, host, port },
) {
  Object.assign(server, { protocol, host, port });
  const message = `${protocol.toUpperCase()} - Listening on ${host}:${port}`;
  startupLog.log(message);
};


module.exports = {
  startServer,
};
