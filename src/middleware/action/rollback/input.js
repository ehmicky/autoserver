'use strict';

const { omit } = require('../../../utilities');

// Retrieve a database input that reverts the write action, if it was
// successful, or is a noop, if it was not performed.
const getRollbackInput = function ({ command, args, ...input }) {
  const inputs = handlers[command](args);
  return inputs.map(inputA => ({ ...input, ...inputA }));
};

// Rollback `create` with a `delete`
const deleteRollback = function ({ newData, ...args }) {
  if (newData.length === 0) { return []; }

  const deletedIds = newData.map(({ id }) => id);
  const argsA = { ...args, deletedIds };
  const argsB = omit(argsA, ['newData']);
  return [{ command: 'delete', args: argsB }];
};

// Rollback `patch|delete` by upserting the original models
const upsertRollback = function ({ currentData, ...args }) {
  if (currentData.length === 0) { return []; }

  const argsA = { ...args, currentData, newData: currentData };
  const argsB = omit(argsA, ['deletedIds']);
  return [{ command: 'upsert', args: argsB }];
};

// Rollback `upsert` by either deleting the model (if it did not exist before),
// or upserting the original model (it it existed before)
const deleteOrUpsertRollback = function (args) {
  return [...getDeleteRollback(args), ...getUpsertRollback(args)];
};

const getDeleteRollback = function ({ currentData, newData, ...args }) {
  const deletedData = newData
    .filter((datum, index) => currentData[index] === undefined);
  const currentDataA = currentData
    .filter(currentDatum => currentDatum === undefined);
  const deletedArgs = {
    ...args,
    currentData: currentDataA,
    newData: deletedData,
  };
  const deleteInput = deleteRollback(deletedArgs);
  return deleteInput;
};

const getUpsertRollback = function ({ currentData, ...args }) {
  const upsertData = currentData
    .filter(currentDatum => currentDatum !== undefined);
  const upsertArgs = { ...args, currentData: upsertData };
  const upsertInput = upsertRollback(upsertArgs);
  return upsertInput;
};

const handlers = {
  create: deleteRollback,
  patch: upsertRollback,
  delete: upsertRollback,
  upsert: deleteOrUpsertRollback,
};

module.exports = {
  getRollbackInput,
};
