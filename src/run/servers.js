'use strict';

const { assignObject } = require('../utilities');
const { protocols, protocolHandlers } = require('../protocols');
const { getMiddleware } = require('../middleware');
const { emitEvent } = require('../events');
const { monitor } = require('../perf');
const { createIfv, compileIdlFuncs } = require('../idl_func');

// Start each server
const startServers = async function ({ runtimeOpts, runtimeOpts: { idl } }) {
  const [idlA, compileIdlFuncsMeasure] = await mCompileIdlFuncs({ idl });
  const [{ ifv }, createIfvMeasure] = await mCreateIfv({ idl: idlA });

  // This callback must be called by each server
  const middleware = await getMiddleware();
  const requestHandler = middleware.bind(null, { idl: idlA, runtimeOpts, ifv });

  const [servers, serverMeasures] = await startEachServer({
    runtimeOpts,
    requestHandler,
  });

  const measures = [
    compileIdlFuncsMeasure,
    createIfvMeasure,
    ...serverMeasures,
  ];

  return [{ servers, idl: idlA }, measures];
};

const mCompileIdlFuncs = monitor(compileIdlFuncs, 'compileIdlFuncs', 'server');

const mCreateIfv = monitor(createIfv, 'createIfv', 'server');

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
