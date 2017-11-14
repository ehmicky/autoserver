'use strict';

const { hasBody } = require('type-is');
const getBody = require('raw-body');

const { throwError, addGenErrorHandler } = require('../../../error');

const { handleDecompression } = require('./compression');

// Loads raw request payload
// Should handle:
//  - protocol encoding/compression
//  - throwing INPUT_LIMIT error if request length is over maxpayload.
//    This is not done in a protocol-agnostic way, as we want to take advantage
//    of streaming, i.e. not waiting for end of stream to throw error.
//  - if the protocol forces content-length to be specified, handle that
// Should not handle (as it is done in protocol-agnostic way):
//  - charset decoding
//  - content parsing. Return raw buffer instead
const getPayload = function ({ specific, maxpayload }) {
  const length = getContentLength({ specific });

  const req = handleDecompression({ specific });

  return eGetRawBody({ req, length, maxpayload });
};

const getRawBody = function ({ req, length, maxpayload }) {
  return getBody(req, { length, limit: maxpayload });
};

// `raw-body` throws some errors related to INPUT_LIMIT that we want to
// convert to the correct error reason
const eGetRawBody = addGenErrorHandler(getRawBody, {
  message: (input, { message }) => message,
  reason: (input, { status }) =>
    (status === INPUT_LIMIT_STATUS ? 'INPUT_LIMIT' : 'PAYLOAD_PARSE'),
});

const INPUT_LIMIT_STATUS = 413;

// Retrieves payload length
const getContentLength = function ({ specific: { req: { headers } } }) {
  const contentLength = headers['content-length'];
  if (contentLength !== undefined) { return contentLength; }

  const message = 'Must specify HTTP header \'Content-Length\' when sending a request payload';
  throwError(message, { reason: 'NO_CONTENT_LENGTH' });
};

// Check if there is a request payload
const hasPayload = function ({ specific: { req } }) {
  return hasBody(req);
};

module.exports = {
  getPayload,
  hasPayload,
};
