'use strict';

const { isEqual } = require('lodash');

// Merge two sets of actions
const mergeActions = function ({ actions, actionsA }) {
  return actions.map(action => mergeAction({ action, actionsA }));
};

const mergeAction = function ({ action, actionsA }) {
  const actionA = actionsA
    .find(({ commandPath }) => isEqual(commandPath, action.commandPath));
  if (actionA === undefined) { return action; }

  return {
    ...action,
    ...actionA,
    args: { ...action.args, ...actionA.args },
  };
};

module.exports = {
  mergeActions,
};
