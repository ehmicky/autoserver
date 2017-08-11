'use strict';

const { assignObject, makeImmutable } = require('../../utilities');
const { protocols, protocolHandlers } = require('../../protocols');
const { getMiddleware } = require('../../middleware');
const { reportLog } = require('../../logging');
const { monitor } = require('../../perf');
const { createJsl } = require('../../jsl');

// Start each server
const startServers = async function ({
  idl,
  apiServer,
  startupLog,
  processLog,
  runtimeOpts,
}) {
  const [jsl, jslMeasure] = await monitoredCreateJsl({ idl });

  // This callback must be called by each server
  const middleware = await getMiddleware();
  const requestHandler = middleware.bind(null, {
    idl,
    apiServer,
    runtimeOpts,
    jsl,
  });

  const [servers, serverMeasures] = await startEachServer({
    startupLog,
    processLog,
    runtimeOpts,
    requestHandler,
  });

  makeImmutable(runtimeOpts);
  // eslint-disable-next-line fp/no-mutating-assign
  Object.assign(apiServer, { runtimeOpts, servers });

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

const startServer = async function (protocol, {
  startupLog,
  processLog,
  runtimeOpts,
  requestHandler,
}) {
  const protocolHandler = protocolHandlers[protocol];
  const opts = runtimeOpts[protocol.toLowerCase()];
  const handleRequest = specific => requestHandler({ protocol, specific });

  const serverInfo = await protocolHandler.startServer({
    opts,
    runtimeOpts,
    processLog,
    handleRequest,
  });

  await logStart({ serverInfo, startupLog, protocol });

  return { ...serverInfo, protocol };
};

const logStart = async function ({ serverInfo, startupLog, protocol }) {
  const { host, port } = serverInfo;
  const message = `${protocol.toUpperCase()} - Listening on ${host}:${port}`;
  await reportLog({ log: startupLog, level: 'log', message });
};

const monitoredStartServer = monitor(
  startServer,
  protocol => protocol,
  'server',
);

module.exports = {
  startServers,
};
