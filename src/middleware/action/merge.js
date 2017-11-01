'use strict';

const { isEqual } = require('../../utilities');

// Merge two sets of actions
const mergeActions = function ({ actions, newActions }) {
  return actions.map(action => mergeAction({ action, newActions }));
};

const mergeAction = function ({ action, newActions }) {
  const newAction = newActions
    .find(({ commandPath }) => isEqual(commandPath, action.commandPath));
  if (newAction === undefined) { return action; }

  return {
    ...action,
    ...newAction,
    args: { ...action.args, ...newAction.args },
    // Flag used by validateSelectAction middleware
    isWrite: true,
  };
};

module.exports = {
  mergeActions,
};
