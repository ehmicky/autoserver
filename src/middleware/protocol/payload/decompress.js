'use strict';

const { addGenErrorHandler } = require('../../../error');

// Request body decompression
const decompressPayload = function ({ compressRequest, payload }) {
  if (compressRequest === undefined) { return payload; }

  return compressRequest.decompress({ content: payload });
};

const eDecompressPayload = addGenErrorHandler(decompressPayload, {
  message: ({ compressRequest: { name } }) =>
    `Could not decompress the request payload using the '${name}' algorithm`,
  reason: 'REQUEST_FORMAT',
});

module.exports = {
  decompressPayload: eDecompressPayload,
};
