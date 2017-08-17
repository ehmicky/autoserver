'use strict';

const { throwError, addErrorHandler } = require('../../../../../error');
const { decode } = require('../../encoding');

// Returns response.metadata related to pagination, after decoding token
const getOutputData = function ({ metadata }) {
  return metadata.map(metadatum => getOutputMetadata({ metadatum }));
};

const getOutputMetadata = function ({
  metadatum: { pages, pages: { token } },
}) {
  if (token === undefined || token === '') { return pages; }

  validateToken({ token });

  return eGetToken({ pages, token });
};

const getToken = function ({ pages, token }) {
  const parsedToken = decode({ token });
  return { ...pages, token: parsedToken };
};

const eGetToken = addErrorHandler(getToken, {
  message: 'Wrong response: \'token\' is invalid',
  reason: 'OUTPUT_VALIDATION',
});

const validateToken = function ({ token }) {
  if (typeof token !== 'string') {
    const message = 'Wrong response: \'token\' must be a string';
    throwError(message, { reason: 'OUTPUT_VALIDATION' });
  }
};

module.exports = {
  getOutputData,
};
