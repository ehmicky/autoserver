'use strict';

const { isEqual } = require('lodash');

// Retrieves `operationSummary`
const getOperationSummary = function ({ actions }) {
  const topLevelAction = actions
    .find(({ actionPath }) => actionPath.length === 1);
  return getSummary({ action: topLevelAction, actions });
};

// Returns all actions, included nested ones as a nice formatted string,
// e.g. 'findModel{attrA,attrB,child{attrC}}'
const getSummary = function ({
  action: { actionName, actionPath },
  actions,
}) {
  const childActions = actions.filter(({
    actionPath: childPath,
    // In write actions, do not use child actions only used for selections
    usesTopAction,
  }) =>
    isEqual(actionPath, childPath.slice(0, -1)) && usesTopAction
  );
  if (childActions.length === 0) { return actionName; }

  const childActionsStr = childActions
    .map(childAction => getSummary({ action: childAction, actions }))
    .join(',');
  return `${actionName}{${childActionsStr}}`;
};

module.exports = {
  getOperationSummary,
};
