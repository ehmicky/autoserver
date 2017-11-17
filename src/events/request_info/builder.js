'use strict';

const { getReason } = require('../../error');
const { MODEL_TYPES } = require('../../constants');
const { DEFAULT_FORMAT } = require('../../formats');

// Builds requestinfo from request mInput
const buildRequestinfo = function ({
  requestid,
  timestamp,
  responsetime,
  ip,
  protocol,
  origin,
  path,
  method,
  status = 'SERVER_ERROR',
  pathvars,
  queryvars,
  headers,
  format: { name: format = 'raw' } = DEFAULT_FORMAT,
  charset,
  payload,
  rpc,
  summary,
  topargs: args,
  commandpath,
  command,
  collname: collection,
  metadata,
  response: {
    content: response,
    type: responsetype,
  } = {},
  modelscount,
  uniquecount,
  error,
}) {
  const responsedata = MODEL_TYPES.includes(responsetype)
    ? response.data
    : response;
  const errorReason = error && getReason({ error });

  return {
    requestid,
    timestamp,
    responsetime,
    ip,
    protocol,
    origin,
    path,
    method,
    status,
    pathvars,
    queryvars,
    headers,
    format,
    charset,
    payload,
    rpc,
    summary,
    args,
    commandpath,
    command,
    collection,
    responsedata,
    responsetype,
    metadata,
    modelscount,
    uniquecount,
    error: errorReason,
  };
};

module.exports = {
  buildRequestinfo,
};
