'use strict';

const { getParentActions } = require('./parent_actions');
const { getInput } = require('./input');
const { addNestedFilter } = require('./parent_results');
const { getConcurrentCommand, getPendingResults } = require('./concurrent');
const { fireReadCommand } = require('./command');
const { processResults } = require('./results');

// Fire all commands associated with a set of read actions
const sequenceRead = async function (
  { actions, top, collsMap, mInput },
  nextLayer,
) {
  const actionsA = getParentActions({ actions, top, collsMap });

  const results = [];
  await fireReads({ ...mInput, actions: actionsA, results }, nextLayer);

  return { results };
};

const fireReads = function ({ actions, results, ...mInput }, nextLayer) {
  // Siblings can be run in parallel
  // Children will fire this function recursively, waiting for their parent
  const resultsPromises = actions.map(({ parentAction, childActions }) =>
    fireRead({
      action: parentAction,
      childActions,
      actions,
      nextLayer,
      mInput,
      results,
    }));
  return Promise.all(resultsPromises);
};

const fireRead = async function ({
  action,
  action: { args, collname },
  childActions,
  nextLayer,
  mInput,
  mInput: { top },
  results,
}) {
  const {
    isTopLevel,
    parentResults,
    commandName,
    nestedParentIds,
    parentIds,
  } = getInput({ action, results });

  const argsA = addNestedFilter({ args, isTopLevel, parentIds });

  const { concurrentPromises, args: argsB } = getConcurrentCommand({
    args: argsA,
    results,
    collname,
  });

  const promise = fireReadCommand({
    action,
    mInput,
    nextLayer,
    args: argsB,
  });

  const pendingResults = getPendingResults({
    args: argsB,
    collname,
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
    top,
    collname,
  });

  // Recursive call
  // Child actions must start after their parent ends
  const mInputA = { ...mInput, actions: childActions, results };
  await fireReads(mInputA, nextLayer);
};

module.exports = {
  sequenceRead,
};
