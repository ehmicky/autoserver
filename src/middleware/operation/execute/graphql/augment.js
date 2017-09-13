'use strict';

// Add `action.actionName` helpers
const augmentActions = function ({ actions }) {
  return actions.map(augmentAction);
};

const augmentAction = function ({ actionPath, ...rest }) {
  const actionName = actionPath[actionPath.length - 1];

  return { ...rest, actionPath, actionName };
};

module.exports = {
  augmentActions,
};
