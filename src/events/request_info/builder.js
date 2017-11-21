'use strict';

const { getReason } = require('../../error');
const { MODEL_TYPES } = require('../../constants');
const { DEFAULT_FORMAT } = require('../../formats');
const { DEFAULT_COMPRESS } = require('../../compress');

// Builds requestinfo from request mInput
const buildRequestinfo = function ({
  requestid,
  timestamp,
  duration,
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
  compressResponse: { name: compressResponse } = DEFAULT_COMPRESS,
  compressRequest: { name: compressRequest } = DEFAULT_COMPRESS,
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

  const compress = `${compressResponse},${compressRequest}`;

  return {
    requestid,
    timestamp,
    duration,
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
    compress,
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
