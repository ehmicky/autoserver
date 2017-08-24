'use strict';

const { assignObject } = require('../utilities');
const { protocols, protocolHandlers } = require('../protocols');
const { getMiddleware } = require('../middleware');
const { emitEvent } = require('../events');
const { monitor } = require('../perf');
const { getHelpers, compileIdlFuncs } = require('../idl_func');
const { getServerInfo } = require('../server_info');

// Start each server
const startServers = async function ({ runOpts, runOpts: { idl } }) {
  const [idlA, compileIdlFuncsMeasure] = await mCompileIdlFuncs({ idl });
  const [helpers, getHelpersMeasure] = await mGetHelpers({ idl: idlA });
  const [serverInfo, serverInfoMeasure] = await mGetServerInfo({ runOpts });

  // This callback must be called by each server
  const middleware = await getMiddleware();
  const baseInput = { idl: idlA, runOpts, ...helpers, serverInfo };

  const [servers, serverMeasures] = await startEachServer({
    runOpts,
    middleware,
    baseInput,
  });

  const measures = [
    compileIdlFuncsMeasure,
    getHelpersMeasure,
    serverInfoMeasure,
    ...serverMeasures,
  ];

  return [{ servers, idl: idlA }, measures];
};

const mCompileIdlFuncs = monitor(compileIdlFuncs, 'compileIdlFuncs', 'server');
const mGetHelpers = monitor(getHelpers, 'getHelpers', 'server');
const mGetServerInfo = monitor(getServerInfo, 'getServerInfo', 'server');

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
  const protocolHandler = protocolHandlers[protocol];
  const baseInputA = { ...baseInput, protocol, protocolHandler };
  const handleRequest = fireHandleRequest.bind(
    null,
    { middleware, baseInput: baseInputA },
  );

  const opts = runOpts[protocol.toLowerCase()];
  const serverInfo = await protocolHandler.startServer({
    opts,
    runOpts,
    handleRequest,
  });

  await startEvent({ serverInfo, protocol, runOpts });

  return { ...serverInfo, protocol };
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
