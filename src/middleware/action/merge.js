'use strict';

const { isEqual } = require('../../utilities');

// Merge two sets of actions
const mergeActions = function ({ actions, newActions }) {
  const actionsA = actions.map(action => mergeAction({ action, newActions }));
  const newActionsA = newActions
    .filter(newAction => isNotMerged({ actions, newAction }));
  return [...actionsA, ...newActionsA];
};

const mergeAction = function ({ action, newActions }) {
  const newActionA = newActions
    .find(newAction => hasSamePath({ action, newAction }));
  if (newActionA === undefined) { return action; }

  return {
    ...action,
    ...newActionA,
    args: { ...action.args, ...newActionA.args },
  };
};

const isNotMerged = function ({ actions, newAction }) {
  return actions.every(action => !hasSamePath({ action, newAction }));
};

const hasSamePath = function ({ action, newAction }) {
  return isEqual(action.commandPath, newAction.commandPath);
};

module.exports = {
  mergeActions,
};
