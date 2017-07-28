'use strict';

const { v4: uuidv4 } = require('uuid');

const { getServerInfo } = require('../../info');
const { addJsl } = require('../../jsl');
const { addLogInfo } = require('../../logging');

// Assigns unique ID (UUIDv4) to each request
// Available in:
//  - input, as `requestId`
//  - logs, as `requestId`
//  - JSL parameters, as `$REQUEST_ID`
//  - response headers, as `X-Request-Id`
// Also send response headers for `X-Server-Name` and `X-Server-Id`
const setRequestIds = async function (nextFunc, input) {
  const { specific, protocolHandler, serverOpts } = input;

  const requestId = uuidv4();
  const inputA = addJsl(input, { $REQUEST_ID: requestId });
  const inputB = addLogInfo(inputA, { requestId });
  const inputC = { ...inputB, requestId };

  sendRequestIdHeader({ specific, requestId, protocolHandler });
  sendServerIdsHeaders({ specific, serverOpts, protocolHandler });

  const response = await nextFunc(inputC);
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
