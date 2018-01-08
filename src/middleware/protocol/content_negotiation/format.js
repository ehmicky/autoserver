'use strict';

const { throwError } = require('../../../errors');
const {
  DEFAULT_FORMAT,
  formatExists,
  isSafeFormat,
} = require('../../../formats');

// Retrieve format asked by client for the response payload
const getFormat = function ({ queryvars, format }) {
  const formatA = pickFormat({ queryvars, format });
  if (formatA === undefined) { return; }

  validateFormat({ format: formatA });

  return formatA;
};

const pickFormat = function ({ queryvars, format }) {
  // ?format query variable
  return queryvars.format ||
    // E.g. MIME in Content-Type HTTP header
    format ||
    DEFAULT_FORMAT;
};

const validateFormat = function ({ format }) {
  const isValidFormat = formatExists({ format }) && isSafeFormat({ format });
  if (isValidFormat) { return; }

  const message = `Unsupported response format: '${format}'`;
  throwError(message, { reason: 'RESPONSE_FORMAT' });
};

module.exports = {
  getFormat,
};
