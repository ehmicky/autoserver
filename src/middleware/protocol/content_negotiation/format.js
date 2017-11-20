'use strict';

const { throwError } = require('../../../error');
const { formatHandlers } = require('../../../formats');

// Retrieve format asked by client for the response payload
const getFormat = function ({ queryvars, format }) {
  // E.g. MIME in Content-Type HTTP header
  const formatName = format ||
    // ?format query variable
    queryvars.format;
  if (formatName === undefined) { return; }

  const formatA = formatHandlers[formatName];
  if (formatA !== undefined) { return formatA; }

  const message = `Unsupported response format: '${formatName}'`;
  throwError(message, { reason: 'RESPONSE_FORMAT' });
};

module.exports = {
  getFormat,
};
