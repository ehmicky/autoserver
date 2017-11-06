'use strict';

const { v4: uuidv4 } = require('uuid');

// Assigns unique ID (UUIDv4) to each request
// Available in:
//  - mInput, as `requestId`
//  - events, as `requestId`
//  - schema system variable `$requestId`
//  - response headers, as `X-Apiengine-Request-Id`
// Also send response headers for `X-Apiengine-Server-Name` and
// `X-Apiengine-Server-Id`
const setRequestIds = function ({ specific, protocolHandler, serverInfo }) {
  const requestId = uuidv4();

  sendRequestIdHeader({ specific, requestId, protocolHandler });
  sendServerIdsHeaders({ specific, serverInfo, protocolHandler });

  return { requestId };
};

// Send e.g. HTTP request header, `X-Apiengine-Request-Id`
const sendRequestIdHeader = function ({
  specific,
  requestId,
  protocolHandler,
}) {
  const responseHeaders = { 'X-Apiengine-Request-Id': requestId };
  protocolHandler.setResponseHeaders({ specific, responseHeaders });
};

// Send e.g. HTTP request header, `X-Apiengine-Server-Name` and
// `X-Apiengine-Server-Id`
const sendServerIdsHeaders = function ({
  specific,
  serverInfo: { serverId, serverName },
  protocolHandler,
}) {
  const responseHeaders = {
    'X-Apiengine-Server-Name': serverName,
    'X-Apiengine-Server-Id': serverId,
  };
  protocolHandler.setResponseHeaders({ specific, responseHeaders });
};

module.exports = {
  setRequestIds,
};
