'use strict';

const { encodingExists } = require('iconv-lite');

// Validate `charset` name is valid
const validateCharset = function ({ charset, format }) {
  validateExisting({ charset });
  validateWithFormat({ charset, format });
};

const validateExisting = function ({ charset }) {
  if (encodingExists(charset)) { return; }

  const message = `Unsupported charset: '${charset}'`;
  // eslint-disable-next-line fp/no-throw
  throw new Error(message);
};

const validateWithFormat = function ({ charset, format: { charsets, title } }) {
  const typeSupportsCharset = charsets === undefined ||
    charsets.includes(charset);
  if (typeSupportsCharset) { return; }

  const message = `Unsupported charset with a ${title} content type: '${charset}'`;
  // eslint-disable-next-line fp/no-throw
  throw new Error(message);
};

module.exports = {
  validateCharset,
};
