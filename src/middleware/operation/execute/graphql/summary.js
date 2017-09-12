'use strict';

const { isEqual } = require('lodash');

const getSummary = function ({ actions }) {
  const topLevelAction = actions.find(({ isTopLevel }) => isTopLevel);
  const operationSummary = getOperationSummary({
    action: topLevelAction,
    actions,
  });
  const { args: topArgs } = topLevelAction;
  return { operationSummary, topArgs };
};

// Returns all actions, included nested ones as a nice formatted string,
// e.g. 'findModel{attrA,attrB,child{attrC}}'
const getOperationSummary = function ({
  action: { actionName, actionPath },
  actions,
}) {
  const childActions = actions.filter(
    ({ actionPath: childPath }) => isEqual(actionPath, childPath.slice(0, -1))
  );
  if (childActions.length === 0) { return actionName; }

  const childActionsStr = childActions
    .map(childAction => getOperationSummary({ action: childAction, actions }))
    .join(',');
  return `${actionName}{${childActionsStr}}`;
};

module.exports = {
  getSummary,
};
