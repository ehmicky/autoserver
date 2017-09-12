'use strict';

// Add `action.isTopLevel` and `action.actionName` helpers
const augmentActions = function ({ actions }) {
  return actions.map(augmentAction);
};

const augmentAction = function ({ actionPath, ...rest }) {
  const isTopLevel = actionPath.length === 1;
  const actionName = actionPath[actionPath.length - 1];

  return { ...rest, actionPath, isTopLevel, actionName };
};

module.exports = {
  augmentActions,
};
