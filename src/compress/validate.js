'use strict';

const { isSupported } = require('./find');

// Validate the compress algorithm exists
const validateAlgo = function ({ algo }) {
  if (isSupported(algo)) { return; }

  const message = `Unsupported compression algorithm: '${algo}'`;
  // eslint-disable-next-line fp/no-throw
  throw new Error(message);
};

module.exports = {
  validateAlgo,
};
