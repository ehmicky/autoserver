/* eslint-disable max-lines */
'use strict';

const { getStandardError } = require('../../error');
const { makeImmutable } = require('../../utilities');
const { getServerinfo } = require('../../serverinfo');

// Retrieve all schema variables
const getVars = function (
  mInput,
  {
    vars: { error, ...vars } = {},
    serverVars,
    mutable = true,
    client = false,
  } = {},
) {
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
    summary,
    commandpaths,
    commandpath,
    collnames,
    collname,
    clientCollnames,
    clientCollname,
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

  // When schema variables are sent to clients, we use client-facing
  // collection names
  const clientVars = client
    ? { collections: clientCollnames, collection: clientCollname }
    : { collections: collnames, collection: collname };

  // Order matters:
  //  - we want to be 100% sure serverVars do not overwrite system variables
  //  - it is possible to overwrite system vars with call-specific `vars`
  const varsA = {
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
    ...clientVars,
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

  // This is a bit slow, but necessary to prevent schema functions from
  // modifying core engine logic
  if (!mutable) {
    makeImmutable(varsA);
  }

  // We do not want to make server-specific variables immutable as it might
  // be very slow, and we are not sure whether making them immutable would
  // break anything
  const varsB = { ...serverVars, ...varsA };

  return varsB;
};

// Normalize `vars.error` so the caller does not have to
const getError = function ({ error, mInput }) {
  if (error === undefined) { return; }

  const errorA = getStandardError({ error, mInput });
  return { error: errorA };
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
  getVars,
  getModelVars,
};

/* eslint-enable max-lines */
