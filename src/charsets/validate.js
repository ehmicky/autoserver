'use strict';

const { encodingExists } = require('iconv-lite');

const { throwError } = require('../error');

// Validate `charset` name is valid
const validateCharset = function ({ charset, format }) {
  validateExisting({ charset });
  validateWithFormat({ charset, format });
};

const validateExisting = function ({ charset }) {
  if (encodingExists(charset)) { return; }

  const message = `Unsupported charset: '${charset}'`;
  throwError(message, { reason: 'RESPONSE_FORMAT' });
};

const validateWithFormat = function ({ charset, format: { charsets, title } }) {
  const typeSupportsCharset = charsets === undefined ||
    charsets.includes(charset);
  if (typeSupportsCharset) { return; }

  const message = `Unsupported charset with a ${title} content type: '${charset}'`;
  throwError(message, { reason: 'RESPONSE_FORMAT' });
};

module.exports = {
  validateCharset,
};
