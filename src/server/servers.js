'use strict';

const { makeImmutable, assignObject } = require('../utilities');
const { protocols, protocolHandlers } = require('../protocols');
const { getMiddleware } = require('../middleware');
const { monitor } = require('../perf');
const { createJsl } = require('../jsl');

// Start each server
const startServers = async function ({
  idl,
  apiServer,
  startupLog,
  processLog,
  serverOpts,
  options,
}) {
  const [jsl, jslMeasure] = await monitoredCreateJsl({ idl });

  // This callback must be called by each server
  const middleware = await getMiddleware();
  const requestHandler = middleware.bind(null, {
    idl,
    apiServer,
    serverOpts,
    jsl,
  });

  const [servers, serverMeasures] = await startEachServer({
    startupLog,
    processLog,
    serverOpts,
    requestHandler,
  });

  Object.assign(apiServer, { options, servers });
  makeImmutable(apiServer);

  const measures = [jslMeasure, ...serverMeasures];

  return [{ servers }, measures];
};

const monitoredCreateJsl = monitor(createJsl, 'createJsl', 'server');

const startEachServer = async function (options) {
  const serversPromises = protocols
    // Can use serverOpts.PROTOCOL.enabled {boolean}
    .filter(protocol => options.serverOpts[protocol.toLowerCase()].enabled)
    .map(protocol => monitoredStartServer(protocol, options));

  // Make sure all servers are starting concurrently, not serially
  const responseArray = await Promise.all(serversPromises);

  const serversArray = responseArray.map(([server]) => server);
  const measures = responseArray.map(([, perf]) => perf);

  // From [server, ...] to { protocol: server }
  const servers = serversArray
    .map((server, index) => ({ [protocols[index]]: server }))
    .reduce(assignObject, {});

  return [servers, measures];
};

const startServer = async function (protocol, {
  startupLog,
  processLog,
  serverOpts,
  requestHandler,
}) {
  const protocolHandler = protocolHandlers[protocol];
  const opts = serverOpts[protocol.toLowerCase()];
  const handleRequest = specific => requestHandler({ protocol, specific });
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

  return server;
};

const monitoredStartServer = monitor(
  startServer,
  protocol => protocol,
  'server',
);

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
  startServers,
};
