'use strict';

const { getInput } = require('./input');
const { getNestedArg } = require('./parent');
const { getConcurrentCommand, getPendingResults } = require('./concurrent');
const { fireReadCommand } = require('./command');
const { processResults } = require('./results');

// Fire all commands associated with a set of read actions
const sequenceRead = async function (
  { actions = [], mInput, results = [] },
  nextLayer,
) {
  // Siblings can be run in parallel
  // Children will fire this function recursively, waiting for their parent
  const resultsPromises = actions.map(({ parentAction, childActions }) =>
    singleSequenceRead({
      action: parentAction,
      childActions,
      actions,
      nextLayer,
      mInput,
      results,
    }));
  await Promise.all(resultsPromises);

  return { results };
};

const singleSequenceRead = async function ({
  action,
  action: { args, modelName },
  childActions,
  nextLayer,
  mInput,
  results,
}) {
  const {
    isTopLevel,
    command,
    parentResults,
    commandName,
    nestedParentIds,
    parentIds,
  } = getInput({ action, results });

  const argsA = getNestedArg({ args, isTopLevel, parentIds });
  const argsB = normalizeIds({ args: argsA });

  const { concurrentPromises, args: argsC } = getConcurrentCommand({
    args: argsB,
    results,
    modelName,
  });

  const promise = fireReadCommand({
    action,
    mInput,
    nextLayer,
    command,
    args: argsC,
    isTopLevel,
    parentResults,
    commandName,
    nestedParentIds,
  });

  const pendingResults = getPendingResults({
    args: argsC,
    modelName,
    results,
    promise,
  });

  // Parent actions must be run first, so we wait here for `promise`
  const finishedResults = await Promise.all([promise, ...concurrentPromises]);

  processResults({
    results,
    finishedResults,
    pendingResults,
    action,
    commandName,
    isTopLevel,
    parentResults,
    nestedParentIds,
  });

  // Recursive call
  // Child actions must start after their parent ends
  await sequenceRead({ actions: childActions, mInput, results }, nextLayer);
};

// Normalize `filter: { id: '...' }` to `filter: { id: ['...'] }`
const normalizeIds = function ({
  args,
  args: { filter: { id, ...filter } = {} },
}) {
  if (typeof id !== 'string') { return args; }

  return {
    ...args,
    filter: { ...filter, id: [id] },
  };
};

module.exports = {
  sequenceRead,
};
