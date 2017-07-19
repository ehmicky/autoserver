'use strict';

const { makeImmutable, assignObject } = require('../utilities');
const { protocols, protocolHandlers } = require('../protocols');
const { getMiddleware } = require('../middleware');

// Start each server
const startAllServers = async function ({
  idl,
  apiServer,
  startupLog,
  processLog,
  serverOpts,
  options,
}) {
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
  const servers = serversArray
    .map((server, index) => ({ [protocols[index]]: server }))
    .reduce(assignObject, {});

  Object.assign(apiServer, { options, servers });
  makeImmutable(apiServer);

  return { servers };
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
  startAllServers,
};
