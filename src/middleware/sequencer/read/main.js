'use strict';

const { getLimits } = require('../../../limits');

const { getParentActions } = require('./parent_actions');
const { getInput } = require('./input');
const { addNestedFilter } = require('./parent_results');
const { getConcurrentCommand, addPendingResults } = require('./concurrent');
const { fireReadCommand } = require('./command');
const { processResults } = require('./results');
const { paginateResults } = require('./paginate');

// Fire all commands associated with a set of read actions
const sequenceRead = async function (
  { actions, top, collsMap, runOpts, mInput },
  nextLayer,
) {
  const { maxmodels } = getLimits({ runOpts });

  const actionsA = getParentActions({ actions, top, collsMap });

  const results = [];
  await fireReads(
    { ...mInput, maxmodels, actions: actionsA, results },
    nextLayer,
  );

  return { results };
};

const fireReads = function ({ actions, results, ...mInput }, nextLayer) {
  // Siblings can be run in parallel
  // Children will fire this function recursively, waiting for their parent
  const resultsPromises = actions.map(({ parentAction, childActions }) =>
    fireRead({
      action: parentAction,
      childActions,
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
  mInput: { top, maxmodels },
  results,
}) {
  const {
    isTopLevel,
    parentResults,
    commandName,
    nestedParentIds,
    parentIds,
  } = getInput({ action, results, maxmodels, top });

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

  const pendingResults = addPendingResults({
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

  paginateResults({ results, maxmodels, top, isTopLevel, childActions });

  // Recursive call
  // Child actions must start after their parent ends
  const mInputA = { ...mInput, actions: childActions, results };
  await fireReads(mInputA, nextLayer);
};

module.exports = {
  sequenceRead,
};
