/* eslint-disable max-lines */
'use strict';

const { getStandardError } = require('../../error');
const { makeImmutable } = require('../../utilities');
const { getServerinfo } = require('../../serverinfo');

// Retrieve schema functions variables
const getFuncVars = function ({ mInput, mInput: { serverVars }, vars }) {
  const varsA = getVars(mInput, { vars });

  // This is a bit slow, but necessary to prevent schema functions from
  // modifying core engine logic
  makeImmutable(varsA);

  // We do not want to make server-specific variables immutable as it might
  // be very slow, and we are not sure whether making them immutable would
  // break anything
  const varsB = { ...serverVars, ...varsA };

  return varsB;
};

// Retrieve all schema variables
const getVars = function (mInput, { vars: { error, ...vars } = {} } = {}) {
  const {
    requestid,
    timestamp = (new Date()).toISOString(),
    duration,
    protocol,
    ip,
    origin,
    path,
    method,
    status,
    queryvars,
    headers,
    format: { name: format } = {},
    charset,
    compress,
    payload,
    payloadsize,
    payloadcount,
    rpc,
    topargs: args,
    topargs: { params: params = {} } = {},
    datasize,
    datacount,
    // `summary`, `commandpaths` and `commandpath` are using client-facing names
    // but `collnames` and `collname` are not
    clientSummary: summary,
    clientCommandpaths: commandpaths,
    clientCommandpath: commandpath,
    collnames: collections,
    collname: collection,
    top: { command: { type: command } = {} } = {},
    responsedata,
    responsedatasize,
    responsedatacount,
    responsetype,
    metadata,
    modelscount,
    uniquecount,
    schema,
    // This is memoized
    serverinfo = getServerinfo({ schema }),
  } = mInput;

  const errorA = getError({ error, mInput });

  // Order matters:
  //  - we want to be 100% sure serverVars do not overwrite system variables
  //  - it is possible to overwrite system vars with call-specific `vars`
  return {
    requestid,
    timestamp,
    duration,
    protocol,
    ip,
    origin,
    path,
    method,
    status,
    queryvars,
    headers,
    format,
    charset,
    compress,
    payload,
    payloadsize,
    payloadcount,
    rpc,
    args,
    params,
    datasize,
    datacount,
    summary,
    commandpaths,
    commandpath,
    collections,
    collection,
    command,
    responsedata,
    responsedatasize,
    responsedatacount,
    responsetype,
    metadata,
    modelscount,
    uniquecount,
    serverinfo,
    ...vars,
    ...errorA,
  };
};

// Normalize `vars.error` so the caller does not have to
const getError = function ({ error, mInput }) {
  if (error === undefined) { return; }

  const errorA = getStandardError({ error, mInput });
  return { error: errorA };
};

// Same as `getVars()` but using client-facing collection names
const getClientVars = function (mInput, ...args) {
  const { clientCollname: collname, clientCollnames: collnames } = mInput;
  const mInputA = { ...mInput, collname, collnames };

  const vars = getVars(mInputA, ...args);
  return vars;
};

// Retrieve model-related system variables
const getModelVars = function ({ model, previousmodel, attrName }) {
  const value = model[attrName];
  const previousvalue = previousmodel == null
    ? undefined
    : previousmodel[attrName];

  return { model, value, previousmodel, previousvalue };
};

module.exports = {
  getFuncVars,
  getVars,
  getClientVars,
  getModelVars,
};

/* eslint-enable max-lines */
