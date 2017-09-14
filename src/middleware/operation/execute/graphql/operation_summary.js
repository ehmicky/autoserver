'use strict';

const { isEqual } = require('lodash');

const { getTopLevelAction } = require('./utilities');

// Retrieves `operationSummary`
const getOperationSummary = function ({ actions }) {
  const topLevelAction = getTopLevelAction({ actions });
  const { actionConstant: { type: topType } } = topLevelAction;
  return getSummary({ action: topLevelAction, actions, topType });
};

// Returns all actions, included nested ones as a nice formatted string,
// e.g. 'findModel{attrA,attrB,child{attrC}}'
const getSummary = function ({
  action: { actionPath },
  actions,
  topType,
}) {
  const actionName = actionPath[actionPath.length - 1];

  const childActions = actions.filter(
    ({ actionPath: childPath, actionConstant }) =>
      isEqual(actionPath, childPath.slice(0, -1)) &&
      // In write actions, do not use child actions only used for selections
      actionConstant.type === topType
  );
  if (childActions.length === 0) { return actionName; }

  const childActionsStr = childActions
    .map(childAction => getSummary({ action: childAction, actions, topType }))
    .join(',');
  return `${actionName}{${childActionsStr}}`;
};

module.exports = {
  getOperationSummary,
};
