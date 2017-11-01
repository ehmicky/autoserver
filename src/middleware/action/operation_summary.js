'use strict';

const { isEqual } = require('../../utilities');

// Retrieves `operationSummary`
// This is all `actions`, included nested ones as a nice formatted string,
// e.g. 'findModel{attrA,attrB,child{attrC}}'
const getOperationSummary = function ({ actions, top, top: { commandPath } }) {
  const commandName = commandPath[commandPath.length - 1];

  const childActions = actions.filter(({ commandPath: childPath }) =>
    isEqual(commandPath, childPath.slice(0, -1)));

  if (childActions.length === 0) {
    return { operationSummary: commandName };
  }

  const childActionsStr = childActions
    .map(action => getChildSummary({ action, actions, top }))
    .join(',');
  const operationSummary = `${commandName}{${childActionsStr}}`;

  return { operationSummary };
};

const getChildSummary = function ({ action: { commandPath }, actions, top }) {
  const topA = { ...top, commandPath };
  const { operationSummary } = getOperationSummary({ actions, top: topA });
  return operationSummary;
};

module.exports = {
  getOperationSummary,
};
