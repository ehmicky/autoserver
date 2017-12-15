'use strict';

const { throwError } = require('../../../error');
const { formatAdapters, DEFAULT_FORMAT } = require('../../../formats');

// Retrieve format asked by client for the response payload
const getFormat = function ({ queryvars, format }) {
  const formatName = getFormatName({ queryvars, format });
  if (formatName === undefined) { return; }

  const formatA = formatAdapters[formatName];

  validateFormat({ format: formatA, formatName });

  return formatA;
};

const getFormatName = function ({ queryvars, format }) {
  // ?format query variable
  return queryvars.format ||
    // E.g. MIME in Content-Type HTTP header
    format ||
    DEFAULT_FORMAT.name;
};

const validateFormat = function ({ format, formatName }) {
  if (format !== undefined && !format.unsafe) { return; }

  const message = `Unsupported response format: '${formatName}'`;
  throwError(message, { reason: 'RESPONSE_FORMAT' });
};

module.exports = {
  getFormat,
};
