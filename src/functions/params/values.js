/* eslint-disable max-lines */
'use strict';

const { getStandardError } = require('../../errors');
const { makeImmutable } = require('../../utilities');
const { getServerinfo } = require('../../serverinfo');

// Retrieve all parameters
const getParams = function (
  mInput,
  {
    params: { error, ...params } = {},
    serverParams,
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
    format,
    charset,
    compress,
    payload,
    payloadsize,
    payloadcount,
    rpc,
    topargs: args,
    topargs: { params: clientParams = {} } = {},
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
    config,
    // This is memoized
    serverinfo = getServerinfo({ config }),
  } = mInput;

  const errorA = getError({ error, mInput });

  // When parameters are sent to clients, we use client-facing
  // collection names
  const clientNamedParams = client
    ? { collections: clientCollnames, collection: clientCollname }
    : { collections: collnames, collection: collname };

  // Order matters:
  //  - we want to be 100% sure serverParams do not overwrite system parameters
  //  - it is possible to overwrite system params with call-specific `params`
  const paramsA = {
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
    params: clientParams,
    datasize,
    datacount,
    summary,
    commandpaths,
    commandpath,
    ...clientNamedParams,
    command,
    responsedata,
    responsedatasize,
    responsedatacount,
    responsetype,
    metadata,
    modelscount,
    uniquecount,
    serverinfo,
    ...params,
    ...errorA,
  };

  // This is a bit slow, but necessary to prevent config functions from
  // modifying core engine logic
  if (!mutable) {
    makeImmutable(paramsA);
  }

  // We do not want to make server-specific parameters immutable as it might
  // be very slow, and we are not sure whether making them immutable would
  // break anything
  const paramsB = { ...serverParams, ...paramsA };

  return paramsB;
};

// Normalize `params.error` so the caller does not have to
const getError = function ({ error, mInput }) {
  if (error === undefined) { return; }

  const errorA = getStandardError({ error, mInput });
  return { error: errorA };
};

// Retrieve model-related system parameters
const getModelParams = function ({ model, previousmodel, attrName }) {
  const value = model[attrName];
  const previousvalue = previousmodel == null
    ? undefined
    : previousmodel[attrName];

  return { model, value, previousmodel, previousvalue };
};

module.exports = {
  getParams,
  getModelParams,
};

/* eslint-enable max-lines */
