'use strict';

const { omit } = require('../../utilities');
const {
  isError,
  normalizeError,
  throwError,
  addErrorHandler,
} = require('../../error');

// Rollback write actions if any of them failed
const rollback = function ({ results, inputs }, nextLayer) {
  const failedActions = results.filter(result => isError({ error: result }));
  if (failedActions.length === 0) { return; }

  return rollbackActions({ failedActions, inputs, nextLayer });
};

const rollbackActions = async function ({ failedActions, inputs, nextLayer }) {
  const promises = inputs
    .map(getRollbackInput)
    .map(input => eFireResponseLayer({ input, nextLayer }));
  // Wait for all rollbacks to end
  const results = await Promise.all(promises);

  rethrowFailure({ failedActions, results });
};

// Retrieve a database input that reverts the write action, if it was
// successful, or is a noop, if it was not performed.
const getRollbackInput = function ({ command, args, ...input }) {
  const { command: commandA, args: argsA } = handlers[command](args);
  return { ...input, command: commandA, args: argsA };
};

// Rollback `create` with a `delete`
const deleteRollback = function ({ newData, ...args }) {
  const deletedIds = newData.map(({ id }) => id);
  const argsA = { ...args, deletedIds };
  const argsB = omit(argsA, ['newData']);
  return { command: 'delete', args: argsB };
};

// Rollback `patch|replace|delete` by upserting the original models
const upsertRollback = function ({ currentData, ...args }) {
  const argsA = { ...args, newData: currentData };
  const argsB = omit(argsA, ['deletedIds']);
  return { command: 'replace', args: argsB };
};

const handlers = {
  create: deleteRollback,
  patch: upsertRollback,
  replace: upsertRollback,
  delete: upsertRollback,
};

// Only need to fire `database` layer, not `request` nor `response` layers
// This also means we are bypassing authorization
const fireResponseLayer = function ({ input, nextLayer }) {
  return nextLayer(input, 'database');
};

const responseHandler = function (error) {
  return normalizeError({ error });
};

const eFireResponseLayer = addErrorHandler(fireResponseLayer, responseHandler);

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
  rollback,
};
