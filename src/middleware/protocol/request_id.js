'use strict';

const { v4: uuidv4 } = require('uuid');

const { getServerInfo } = require('../../info');
const { addIfv } = require('../../idl_func');
const { addReqInfo } = require('../../events');

// Assigns unique ID (UUIDv4) to each request
// Available in:
//  - input, as `requestId`
//  - events, as `requestId`
//  - IDL function variables, as `$REQUEST_ID`
//  - response headers, as `X-Request-Id`
// Also send response headers for `X-Server-Name` and `X-Server-Id`
const setRequestIds = function (nextFunc, input) {
  const { specific, protocolHandler, runOpts } = input;

  const requestId = uuidv4();
  const inputA = addIfv(input, { $REQUEST_ID: requestId });
  const inputB = addReqInfo(inputA, { requestId });
  const inputC = { ...inputB, requestId };

  sendRequestIdHeader({ specific, requestId, protocolHandler });
  sendServerIdsHeaders({ specific, runOpts, protocolHandler });

  return nextFunc(inputC);
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
  runOpts,
  protocolHandler,
}) {
  const { serverId, serverName } = getServerInfo({ runOpts });
  const headers = { 'X-Server-Name': serverName, 'X-Server-Id': serverId };
  protocolHandler.sendHeaders({ specific, headers });
};

module.exports = {
  setRequestIds,
};
