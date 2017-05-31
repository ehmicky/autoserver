'use strict';


const uuidv4 = require('uuid/v4');

const { httpHeaders } = require('../../../parsing');


// Assigns unique ID (UUIDv4) to each request
// Available in:
//  - input, as `requestId`
//  - logs, as `requestId`
//  - JSL parameters, as `$REQUEST_ID`
//  - response headers, as `X-Request-Id`
const setRequestId = function () {
  return async function setRequestId(input) {
    const { jsl, log } = input;

    const requestId = uuidv4();
    const newJsl = jsl.add({ $REQUEST_ID: requestId });
    log.add({ requestId });

    Object.assign(input, { requestId, jsl: newJsl });

    sendRequestIdHeader(input);

    const response = await this.next(input);
    return response;
  };
};

// Send e.g. HTTP request header
const sendRequestIdHeader = function ({ specific, protocol, requestId }) {
  const sendHeader = sendHeadersMap[protocol].send;
  const headers = { 'X-Request-Id': requestId };
  sendHeader({ specific, headers });
};

const sendHeadersMap = {
  http: httpHeaders,
};


module.exports = {
  setRequestId,
};
