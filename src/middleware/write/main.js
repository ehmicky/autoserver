'use strict';

const { assignArray, groupValuesBy } = require('../../utilities');
const { mergeCommandPaths } = require('../../constants');

const { getArgs } = require('./args');
const { getResults } = require('./results');

// Fire all commands associated with a set of write actions
const sequenceWrite = async function ({ actions, top, mInput }, nextLayer) {
  // Run write commands in parallel, for each `modelName`
  const actionsGroups = groupValuesBy(actions, 'modelName');
  const resultsPromises = actionsGroups
    .map(actionsA => getCommandArgs({ actions: actionsA, top }))
    .filter(isNotEmpty)
    .map(allInput => getInput({ ...allInput, top, mInput }))
    .map(allInput => fireCommand({ ...allInput, top, nextLayer }));
  const results = await Promise.all(resultsPromises);

  const resultsA = results.reduce(assignArray, []);
  return { results: resultsA };
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

const fireCommand = async function ({
  actions,
  ids,
  top,
  input,
  input: { modelName },
  nextLayer,
}) {
  const { response: { data } } = await nextLayer(input, 'request_response');

  const resultsA = getResults({ actions, results: data, ids, modelName, top });
  return resultsA;
};

module.exports = {
  sequenceWrite,
};
