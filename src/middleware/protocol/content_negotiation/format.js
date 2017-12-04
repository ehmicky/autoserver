'use strict';

const { throwError } = require('../../../error');
const { formatHandlers, DEFAULT_FORMAT } = require('../../../formats');

// Retrieve format asked by client for the response payload
const getFormat = function ({ queryvars, format }) {
  const formatName = getFormatName({ queryvars, format });
  if (formatName === undefined) { return; }

  const formatA = formatHandlers[formatName];
  if (formatA !== undefined) { return formatA; }

  const message = `Unsupported response format: '${formatName}'`;
  throwError(message, { reason: 'RESPONSE_FORMAT' });
};

const getFormatName = function ({ queryvars, format }) {
  // ?format query variable
  return queryvars.format ||
    // E.g. MIME in Content-Type HTTP header
    format ||
    DEFAULT_FORMAT.name;
};

module.exports = {
  getFormat,
};
