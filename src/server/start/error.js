'use strict';

const { getStandardError, rethrowError } = require('../../error');
const { reportLog } = require('../../logging');

// Handle exceptions thrown at server startup
const handleStartupError = async function ({ error, runtimeOpts }) {
  const errorA = getStandardError({ error });

  const info = { errorInfo: errorA };
  await reportLog({ type: 'failure', phase: 'startup', info, runtimeOpts });

  rethrowError(errorA);
};

module.exports = {
  handleStartupError,
};
