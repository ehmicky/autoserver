'use strict';

const { v4: uuidv4 } = require('uuid');

// Assigns unique ID (UUIDv4) to each request
// Available in:
//  - mInput, as `requestId`
//  - events, as `requestId`
//  - schema system variable `$requestId`
//  - response headers, as `X-Apiengine-Request-Id`
// Also send response headers for `X-Apiengine-Servername` and
// `X-Apiengine-Serverid`
const setRequestIds = function ({ specific, protocolHandler, serverinfo }) {
  const requestId = uuidv4();

  sendRequestIdHeader({ specific, requestId, protocolHandler });
  sendServeridsHeaders({ specific, serverinfo, protocolHandler });

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

// Send e.g. HTTP request header, `X-Apiengine-Servername` and
// `X-Apiengine-Serverid`
const sendServeridsHeaders = function ({
  specific,
  serverinfo: { serverid, servername },
  protocolHandler,
}) {
  const responseHeaders = {
    'X-Apiengine-Servername': servername,
    'X-Apiengine-Serverid': serverid,
  };
  protocolHandler.setResponseHeaders({ specific, responseHeaders });
};

module.exports = {
  setRequestIds,
};
