'use strict';

const { getInput } = require('./input');
const { addNestedFilter } = require('./parent');
const { getConcurrentCommand, getPendingResults } = require('./concurrent');
const { fireReadCommand } = require('./command');
const { processResults } = require('./results');

// Fire all commands associated with a set of read actions
const sequenceRead = async function (
  { actionsGroupType, actions = [], mInput, results = [] },
  nextLayer,
) {
  if (actionsGroupType !== 'read') { return; }

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

  const argsA = addNestedFilter({ args, isTopLevel, parentIds });

  const { concurrentPromises, args: argsB } = getConcurrentCommand({
    args: argsA,
    results,
    modelName,
  });

  const promise = fireReadCommand({
    action,
    mInput,
    nextLayer,
    command,
    args: argsB,
  });

  const pendingResults = getPendingResults({
    args: argsB,
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
  const input = {
    actionsGroupType: 'read',
    actions: childActions,
    mInput,
    results,
  };
  await sequenceRead(input, nextLayer);
};

module.exports = {
  sequenceRead,
};
