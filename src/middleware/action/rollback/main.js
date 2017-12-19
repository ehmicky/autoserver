'use strict';

const { flatten } = require('../../../utilities');
const { isError, normalizeError, addErrorHandler } = require('../../../errors');

const { getRollbackInput } = require('./input');
const { rethrowFailure } = require('./failure');

// Rollback write actions if any of them failed
const rollback = function ({ results, inputs }, nextLayer) {
  const failedActions = results.filter(result => isError({ error: result }));
  if (failedActions.length === 0) { return; }

  return rollbackActions({ failedActions, inputs, nextLayer });
};

const rollbackActions = async function ({ failedActions, inputs, nextLayer }) {
  const inputsA = inputs.map(getRollbackInput);
  const inputsB = flatten(inputsA);
  const promises = inputsB
    .map(input => eFireResponseLayer({ input, nextLayer }));
  // Wait for all rollbacks to end
  const results = await Promise.all(promises);

  rethrowFailure({ failedActions, results });
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

module.exports = {
  rollback,
};
