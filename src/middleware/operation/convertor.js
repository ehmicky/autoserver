'use strict';

// Converts from Protocol format to Operation format
const operationConvertor = async function ({
  goal,
  queryVars,
  pathVars,
  params,
  settings,
  payload,
  route,
  origin,
  jsl,
  log,
  perf,
  idl,
  serverOpts,
  apiServer,
}) {
  // Not kept: protocol, protocolFullName, timestamp, requestId, ip, url,
  // path, method, headers
  const newInput = {
    goal,
    queryVars,
    pathVars,
    params,
    settings,
    payload,
    route,
    origin,
    jsl,
    log,
    perf,
    idl,
    serverOpts,
    apiServer,
  };

  const response = await this.next(newInput);
  return response;
};

module.exports = {
  operationConvertor,
};
