'use strict';

const { reportError } = require('./report');

// If error handler fails, only reports failure then gives up
const handleFailure = async function ({ reqInfo, error, runtimeOpts }) {
  const details = error.stack || error;
  const errorA = {
    type: 'ERROR_HANDLER_FAILURE',
    title: 'Error handler failed',
    description: 'Error handler failed',
    details,
  };

  await reportError({ reqInfo, error: errorA, runtimeOpts });

  return errorA;
};

module.exports = {
  handleFailure,
};
