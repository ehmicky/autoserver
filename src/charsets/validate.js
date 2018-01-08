'use strict';

const { encodingExists } = require('iconv-lite');

const { supportsCharset, getTitle } = require('../formats');

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

const validateWithFormat = function ({ charset, format }) {
  if (supportsCharset({ format, charset })) { return; }

  const title = getTitle({ format });
  const message = `Unsupported charset with a ${title} content type: '${charset}'`;
  // eslint-disable-next-line fp/no-throw
  throw new Error(message);
};

module.exports = {
  validateCharset,
};
