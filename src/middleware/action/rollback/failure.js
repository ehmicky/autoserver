'use strict';

const { isError, throwError } = require('../../../errors');

// Rethrow original error
const rethrowFailure = function ({ failedActions, results }) {
  const [innererror] = failedActions;
  const { message } = innererror;
  const extra = getExtra({ results });
  throwError(message, { innererror, extra });
};

// If rollback itself fails, give up and add rollback error to error response,
// as `error.rollback_failures`
const getExtra = function ({ results }) {
  const rollbackFailures = results.filter(result => isError({ error: result }));
  if (rollbackFailures.length === 0) { return; }

  const rollbackFailuresA = rollbackFailures
    .map(({ message }) => message)
    .join('\n');
  return { rollback_failures: rollbackFailuresA };
};

module.exports = {
  rethrowFailure,
};
