'use strict';

const { assignArray, groupValuesBy } = require('../../utilities');
const { addErrorHandler, normalizeError } = require('../../error');
const { mergeCommandPaths } = require('../../constants');

const { getArgs } = require('./args');
const { getResults } = require('./results');

// Fire all commands associated with a set of write actions
const sequenceWrite = async function ({ actions, top, mInput }, nextLayer) {
  // Run write commands in parallel, for each `modelName`
  const actionsGroups = groupValuesBy(actions, 'modelName');
  const allInputs = actionsGroups
    .map(actionsA => getCommandArgs({ actions: actionsA, top }))
    .filter(isNotEmpty)
    .map(allInput => getInput({ ...allInput, top, mInput }))
    .map(allInput => fireRequestLayer({ ...allInput, nextLayer }));

  // Used by rollback middleware to revert each action
  const inputs = allInputs.map(({ input }) => input);

  const resultsPromises = allInputs
    .map(allInput => eFireResponseLayer({ ...allInput, top, nextLayer }));
  const results = await Promise.all(resultsPromises);

  const resultsA = results.reduce(assignArray, []);
  return { results: resultsA, inputs };
};

// Add next layers's `args` and `ids`
const getCommandArgs = function ({ actions, top }) {
  const { args, ids } = getArgs({ actions, top });
  return { actions, args, ids };
};

// If no model to modify, can return empty array right away
const isNotEmpty = function ({ ids }) {
  return ids.length !== 0;
};

// Add next layers's whole input
const getInput = function ({
  actions,
  actions: [{ modelName }],
  args,
  top: { command: { type: command } },
  mInput,
  ...rest
}) {
  const commandPath = mergeCommandPaths({ actions });
  const input = { ...mInput, commandPath, command, modelName, args };
  return { input, actions, ...rest };
};

// Fire `request` layer, which is not async
// We make sure all commands went through the `request` layer before firing
// the `response` layer because we want to avoid unnecessary
// rollbacks if `request` layer throws
const fireRequestLayer = function ({ input, nextLayer, ...rest }) {
  const inputA = nextLayer(input, 'request');
  return { ...rest, input: inputA };
};

const fireResponseLayer = async function ({
  actions,
  ids,
  top,
  input,
  input: { modelName },
  nextLayer,
}) {
  // Since some commands will wait for others to finish, and I/O is slow,
  // we fire `response` layer right away, to save CPU time
  const { response } = await nextLayer(input, 'database');
  const inputA = { ...input, response };

  const { response: { data: results } } = await nextLayer(inputA, 'response');

  const resultsA = getResults({ actions, results, ids, modelName, top });
  return resultsA;
};

// If write action fails, we wait for the other write actions to end,
// then perform a rollback later. We return the error with success.
const responseHandler = function (error) {
  const errorA = normalizeError({ error });
  return [errorA];
};

const eFireResponseLayer = addErrorHandler(fireResponseLayer, responseHandler);

module.exports = {
  sequenceWrite,
};
