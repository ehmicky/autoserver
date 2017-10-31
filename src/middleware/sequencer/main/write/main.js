'use strict';

const { assignArray, pick } = require('../../../../utilities');

const { handlers } = require('./handlers');
const { getCurrentData } = require('./current_data');
const { getResults } = require('./results');

// Fire all commands associated with a set of write actions
const sequenceWrite = async function (
  { actionsGroups, top, mInput },
  nextLayer,
) {
  // Run write commands in parallel
  const resultsPromises = actionsGroups.map(actions => singleSequenceWrite({
    actions,
    top,
    nextLayer,
    mInput,
  }));
  const results = await Promise.all(resultsPromises);
  const resultsA = results.reduce(assignArray, []);
  return { results: resultsA };
};

const singleSequenceWrite = async function ({
  actions,
  actions: [{ modelName }],
  top,
  top: { command, args: topArgs },
  nextLayer,
  mInput,
}) {
  const { [command.type]: handler } = handlers;
  const args = handler.mergeArgs({ actions });
  const argsA = applyTopArgs({ args, topArgs });

  // Retrieve model ids
  const ids = handler.getIds({ args: argsA });
  // No model to modify, so can return right away
  if (ids.length === 0) { return []; }

  const currentData = getCurrentData({ actions, ids });
  const argsB = { ...argsA, currentData };

  const results = await fireWriteCommand({
    actions,
    top,
    args: argsB,
    nextLayer,
    mInput,
  });

  return getResults({ actions, results, ids, modelName });
};

// Reuse some whitelisted top-level arguments
const applyTopArgs = function ({ args, topArgs }) {
  const topArgsA = pick(topArgs, ['dryrun']);
  return { ...args, ...topArgsA };
};

// Fire actual write command
const fireWriteCommand = async function ({
  actions: [{ modelName, commandPath }],
  top: { command },
  args,
  nextLayer,
  mInput,
}) {
  const mInputA = {
    ...mInput,
    commandPath,
    command: command.type,
    modelName,
    args,
  };
  const { response: { data: results } } = await nextLayer(mInputA);
  return results;
};

module.exports = {
  sequenceWrite,
};
