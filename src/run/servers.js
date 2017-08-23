'use strict';

const { assignObject } = require('../utilities');
const { protocols, protocolHandlers } = require('../protocols');
const { getMiddleware } = require('../middleware');
const { emitEvent, addReqInfo } = require('../events');
const { monitor } = require('../perf');
const { createIfv, addIfv, compileIdlFuncs } = require('../idl_func');

// Start each server
const startServers = async function ({ runOpts, runOpts: { idl } }) {
  const [idlA, compileIdlFuncsMeasure] = await mCompileIdlFuncs({ idl });
  const [{ ifv }, createIfvMeasure] = await mCreateIfv({ idl: idlA });

  // This callback must be called by each server
  const middleware = await getMiddleware();
  const baseInput = { idl: idlA, runOpts, ifv };

  const [servers, serverMeasures] = await startEachServer({
    runOpts,
    middleware,
    baseInput,
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
    // Can use runOpts.PROTOCOL.enabled {boolean}
    .filter(protocol => options.runOpts[protocol.toLowerCase()].enabled)
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

const startServer = async function (
  protocol,
  { runOpts, middleware, baseInput },
) {
  const baseInputA = addProtocol({ protocol, baseInput });
  const handleRequest = fireHandleRequest.bind(
    null,
    { middleware, baseInput: baseInputA },
  );

  const protocolHandler = protocolHandlers[protocol];
  const opts = runOpts[protocol.toLowerCase()];
  const serverInfo = await protocolHandler.startServer({
    opts,
    runOpts,
    handleRequest,
  });

  await startEvent({ serverInfo, protocol, runOpts });

  return { ...serverInfo, protocol };
};

const addProtocol = function ({ protocol, baseInput }) {
  const protocolHandler = protocolHandlers[protocol];
  const baseInputA = { ...baseInput, protocol, protocolHandler };

  const baseInputB = addIfv(baseInputA, { $PROTOCOL: protocol });
  const baseInputC = addReqInfo(baseInputB, { protocol });
  return baseInputC;
};

const fireHandleRequest = function ({ middleware, baseInput }, specific) {
  middleware({ ...baseInput, specific });
};

const startEvent = async function ({
  serverInfo,
  protocol,
  runOpts,
}) {
  const { host, port } = serverInfo;
  const message = `${protocol.toUpperCase()} - Listening on ${host}:${port}`;
  await emitEvent({ type: 'message', phase: 'startup', message, runOpts });
};

const monitoredStartServer = monitor(
  startServer,
  protocol => protocol,
  'server',
);

module.exports = {
  startServers,
};
