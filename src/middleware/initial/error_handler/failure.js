'use strict';


const { reportError } = require('./report');


// If error handler fails, only reports failure then gives up
const handleFailure = async function ({
  log,
  error: { sendError },
  innererror: error,
}) {
  const details = error.stack || error;
  const errorObj = {
    type: 'ERROR_HANDLER_FAILURE',
    title: 'Error handler failed',
    description: 'Error handler failed',
    details,
  };

  const promises = [];

  if (sendError) {
    const promise = sendError({ type: 'failure' });
    promises.push(promise);
  }

  const promise = reportError({ log, error: errorObj });
  promises.push(promise);

  // Make sure they are performed concurrently, as one failing should not
  // stop the other.
  // Also use await to avoid "unhandled promise" errors
  await Promise.all(promises);
};


module.exports = {
  handleFailure,
};
