'use strict';

const { throwError } = require('../../../../../error');
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

  try {
    const parsedToken = decode({ token });
    return { ...pages, token: parsedToken };
  } catch (error) {
    const message = 'Wrong response: \'token\' is invalid';
    throwError(message, {
      reason: 'OUTPUT_VALIDATION',
      innererror: error,
    });
  }
};

const validateToken = function ({ token }) {
  if (typeof token !== 'string') {
    const message = 'Wrong response: \'token\' must be a string';
    throwError(message, { reason: 'OUTPUT_VALIDATION' });
  }
};

module.exports = {
  getOutputData,
};
