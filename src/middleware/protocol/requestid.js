'use strict';

const { v4: uuidv4 } = require('uuid');

// Assigns unique ID (UUIDv4) to each request
// Available in:
//  - mInput, as `requestid`
//  - events, as `requestid`
//  - schema system variable `$requestid`
//  - response headers, as `X-Apiengine-Requestid`
// Also send response headers for `X-Apiengine-Servername` and
// `X-Apiengine-Serverid`
const setRequestids = function ({ specific, protocolHandler, serverinfo }) {
  const requestid = uuidv4();

  sendRequestidHeader({ specific, requestid, protocolHandler });
  sendServeridsHeaders({ specific, serverinfo, protocolHandler });

  return { requestid };
};

// Send e.g. HTTP request header, `X-Apiengine-Requestid`
const sendRequestidHeader = function ({
  specific,
  requestid,
  protocolHandler,
}) {
  const responseheaders = { 'X-Apiengine-Requestid': requestid };
  protocolHandler.setResponseheaders({ specific, responseheaders });
};

// Send e.g. HTTP request header, `X-Apiengine-Servername` and
// `X-Apiengine-Serverid`
const sendServeridsHeaders = function ({
  specific,
  serverinfo: { serverid, servername },
  protocolHandler,
}) {
  const responseheaders = {
    'X-Apiengine-Servername': servername,
    'X-Apiengine-Serverid': serverid,
  };
  protocolHandler.setResponseheaders({ specific, responseheaders });
};

module.exports = {
  setRequestids,
};
