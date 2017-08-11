'use strict';

const { assignObject } = require('../../utilities');
const { protocols, protocolHandlers } = require('../../protocols');
const { getMiddleware } = require('../../middleware');
const { emitEvent } = require('../../events');
const { monitor } = require('../../perf');
const { createJsl } = require('../../jsl');

// Start each server
const startServers = async function ({ idl, runtimeOpts }) {
  const [jsl, jslMeasure] = await monitoredCreateJsl({ idl });

  // This callback must be called by each server
  const middleware = await getMiddleware();
  const requestHandler = middleware.bind(null, { idl, runtimeOpts, jsl });

  const [servers, serverMeasures] = await startEachServer({
    runtimeOpts,
    requestHandler,
  });

  const measures = [jslMeasure, ...serverMeasures];

  return [{ servers }, measures];
};

const monitoredCreateJsl = monitor(createJsl, 'createJsl', 'server');

const startEachServer = async function (options) {
  const serverInfosPromises = protocols
    // Can use runtimeOpts.PROTOCOL.enabled {boolean}
    .filter(protocol => options.runtimeOpts[protocol.toLowerCase()].enabled)
    .map(protocol => monitoredStartServer(protocol, options));

  // Make sure all servers are starting concurrently, not serially
  const responseArray = await Promise.all(serverInfosPromises);

  const serverInfosArray = responseArray.map(([serverInfo]) => serverInfo);
  const measures = responseArray.map(([, perf]) => perf);

  // From [serverInfo, ...] to { protocol: serverInfo }
  const servers = serverInfosArray
    .map((serverInfo, index) => ({ [protocols[index]]: serverInfo }))
    .reduce(assignObject, {});

  return [servers, measures];
};

const startServer = async function (protocol, { runtimeOpts, requestHandler }) {
  const protocolHandler = protocolHandlers[protocol];
  const opts = runtimeOpts[protocol.toLowerCase()];
  const handleRequest = specific => requestHandler({ protocol, specific });

  const serverInfo = await protocolHandler.startServer({
    opts,
    runtimeOpts,
    handleRequest,
  });

  await startEvent({ serverInfo, protocol, runtimeOpts });

  return { ...serverInfo, protocol };
};

const startEvent = async function ({
  serverInfo,
  protocol,
  runtimeOpts,
}) {
  const { host, port } = serverInfo;
  const message = `${protocol.toUpperCase()} - Listening on ${host}:${port}`;
  await emitEvent({ type: 'message', phase: 'startup', message, runtimeOpts });
};

const monitoredStartServer = monitor(
  startServer,
  protocol => protocol,
  'server',
);

module.exports = {
  startServers,
};
