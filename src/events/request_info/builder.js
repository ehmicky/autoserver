'use strict';

const { getReason } = require('../../error');
const { MODEL_TYPES } = require('../../constants');
const { defaultFormat } = require('../../formats');

// Builds requestinfo from request mInput
const buildRequestinfo = function ({
  requestid,
  timestamp,
  responsetime,
  ip,
  protocol,
  url,
  origin,
  path,
  method,
  protocolstatus,
  status = 'SERVER_ERROR',
  pathvars,
  queryvars,
  requestheaders,
  responseheaders,
  format: { name: format = 'raw' } = defaultFormat,
  charset,
  payload,
  rpc,
  summary,
  topargs: args,
  commandpath,
  command,
  collname: collection,
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
    url,
    origin,
    path,
    method,
    protocolstatus,
    status,
    pathvars,
    queryvars,
    requestheaders,
    responseheaders,
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
    modelscount,
    uniquecount,
    error: errorReason,
  };
};

module.exports = {
  buildRequestinfo,
};
