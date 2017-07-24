'use strict';

const { v4: uuidv4 } = require('uuid');

const { getServerInfo } = require('../../info');

// Assigns unique ID (UUIDv4) to each request
// Available in:
//  - input, as `requestId`
//  - logs, as `requestId`
//  - JSL parameters, as `$REQUEST_ID`
//  - response headers, as `X-Request-Id`
// Also send response headers for `X-Server-Name` and `X-Server-Id`
const setRequestIds = async function (nextFunc, input) {
  const { jsl, log, specific, protocolHandler, serverOpts } = input;

  const requestId = uuidv4();
  const nextInput = jsl.addToInput(input, { $REQUEST_ID: requestId });
  log.add({ requestId });
  Object.assign(nextInput, { requestId });

  sendRequestIdHeader({ specific, requestId, protocolHandler });
  sendServerIdsHeaders({ specific, serverOpts, protocolHandler });

  const response = await nextFunc(nextInput);
  return response;
};

// Send e.g. HTTP request header, `X-Request-Id`
const sendRequestIdHeader = function ({
  specific,
  requestId,
  protocolHandler,
}) {
  const headers = { 'X-Request-Id': requestId };
  protocolHandler.sendHeaders({ specific, headers });
};

// Send e.g. HTTP request header, `X-Server-Name` and `X-Server-Id`
const sendServerIdsHeaders = function ({
  specific,
  serverOpts,
  protocolHandler,
}) {
  const { serverId, serverName } = getServerInfo({ serverOpts });
  const headers = { 'X-Server-Name': serverName, 'X-Server-Id': serverId };
  protocolHandler.sendHeaders({ specific, headers });
};

module.exports = {
  setRequestIds,
};
