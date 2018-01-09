'use strict';

const { addGenErrorHandler } = require('../../../errors');
const { DEFAULT_FORMAT, getFormat } = require('../../../formats');

// Retrieve format asked by client for the response payload
const getFormatFunc = function ({ queryvars, format }) {
  const formatA = getFormatName({ queryvars, format });
  if (formatA === undefined) { return; }

  const formatB = eGetFormat(formatA, { safe: true });
  return formatB;
};

const getFormatName = function ({ queryvars, format }) {
  // ?format query variable
  return queryvars.format ||
    // E.g. MIME in Content-Type HTTP header
    format ||
    DEFAULT_FORMAT.name;
};

const eGetFormat = addGenErrorHandler(getFormat, {
  message: format => `Unsupported response format: '${format}'`,
  reason: 'RESPONSE_FORMAT',
});

module.exports = {
  getFormat: getFormatFunc,
};
