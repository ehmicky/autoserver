'use strict';

const { isEqual } = require('lodash');

// Retrieves `operationSummary`
// This is all actions, included nested ones as a nice formatted string,
// e.g. 'findModel{attrA,attrB,child{attrC}}'
const getOperationSummary = function ({
  actions,
  top,
  top: { actionConstant: { type: topType }, actionPath: topActionPath },
  actionPath = topActionPath,
}) {
  const actionName = actionPath[actionPath.length - 1];

  const childActions = actions.filter(
    ({ actionPath: childPath, actionConstant }) =>
      isEqual(actionPath, childPath.slice(0, -1)) &&
      // In write actions, do not use child actions only used for selections
      actionConstant.type === topType
  );

  if (childActions.length === 0) {
    return { operationSummary: actionName };
  }

  const childActionsStr = childActions
    .map(({ actionPath: childPath }) =>
      getOperationSummary({ actionPath: childPath, actions, top })
    )
    .join(',');
  const operationSummary = `${actionName}{${childActionsStr}}`;

  return { operationSummary };
};

module.exports = {
  getOperationSummary,
};
