'use strict';


const uuidv4 = require('uuid/v4');

const parsing = require('../../../parsing');
const { getServerInfo } = require('../../../info');


// Assigns unique ID (UUIDv4) to each request
// Available in:
//  - input, as `requestId`
//  - logs, as `requestId`
//  - JSL parameters, as `$REQUEST_ID`
//  - response headers, as `X-Request-Id`
// Also send response headers for `X-Server-Name` and `X-Server-Id`
const setRequestIds = function () {
  return async function setRequestId(input) {
    const { jsl, log } = input;
    const perf = log.perf.start('protocol.setRequestId', 'middleware');

    const requestId = uuidv4();
    const newJsl = jsl.add({ $REQUEST_ID: requestId });
    log.add({ requestId });

    Object.assign(input, { requestId, jsl: newJsl });

    sendRequestIdHeader(input);
    sendServerIdsHeaders(input);

    perf.stop();
    const response = await this.next(input);
    return response;
  };
};

// Send e.g. HTTP request header, `X-Request-Id`
const sendRequestIdHeader = function ({ specific, protocol, requestId }) {
  const headers = { 'X-Request-Id': requestId };
  parsing[protocol].headers.send({ specific, headers });
};

// Send e.g. HTTP request header, `X-Server-Name` and `X-Server-Id`
const sendServerIdsHeaders = function ({ specific, protocol }) {
  const { serverId, serverName } = getServerInfo();
  const headers = { 'X-Server-Name': serverName, 'X-Server-Id': serverId };
  parsing[protocol].headers.send({ specific, headers });
};


module.exports = {
  setRequestIds,
};
