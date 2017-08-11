'use strict';

const { getStandardError, rethrowError } = require('../../error');
const { reportLog } = require('../../logging');

// Handle exceptions thrown at server startup
const handleStartupError = async function ({ error, log }) {
  const errorA = getStandardError({ log, error });

  await reportLog({ log, type: 'failure', info: { errorInfo: errorA } });

  rethrowError(errorA);
};

module.exports = {
  handleStartupError,
};
