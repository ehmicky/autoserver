'use strict';

const { v4: uuidv4 } = require('uuid');

// Assigns unique ID (UUIDv4) to each request
// Available in:
//  - mInput, as `requestId`
//  - events, as `requestId`
//  - IDL function variables, as `$REQUEST_ID`
//  - response headers, as `X-Request-Id`
// Also send response headers for `X-Server-Name` and `X-Server-Id`
const setRequestIds = function ({ specific, protocolHandler, serverInfo }) {
  const requestId = uuidv4();

  sendRequestIdHeader({ specific, requestId, protocolHandler });
  sendServerIdsHeaders({ specific, serverInfo, protocolHandler });

  return { requestId };
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
  serverInfo: { serverId, serverName },
  protocolHandler,
}) {
  const headers = { 'X-Server-Name': serverName, 'X-Server-Id': serverId };
  protocolHandler.sendHeaders({ specific, headers });
};

module.exports = {
  setRequestIds,
};
