'use strict';

const { format: formatBytes } = require('bytes');

const {
  throwError,
  addErrorHandler,
  isError,
  rethrowError,
} = require('../../../error');
const { getLimits } = require('../../../limits');

// Use protocol-specific way to parse payload, using a known type
const getRawPayload = function ({ protocolHandler, specific, runOpts }) {
  const { maxpayload } = getLimits({ runOpts });

  return protocolHandler.getPayload({ specific, maxpayload });
};

const getRawPayloadHandler = function (error, { maxpayload }) {
  if (!isError({ error })) {
    const message = 'Could not parse request payload';
    throwError(message, { reason: 'PAYLOAD_PARSE', innererror: error });
  }

  if (error.reason === 'INPUT_LIMIT') {
    const message = `The request payload must not be larger than ${formatBytes(maxpayload)}`;
    throwError(message, { reason: 'INPUT_LIMIT', innererror: error });
  }

  rethrowError(error);
};

const eGetRawPayload = addErrorHandler(getRawPayload, getRawPayloadHandler);

module.exports = {
  getRawPayload: eGetRawPayload,
};
