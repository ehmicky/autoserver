'use strict';

const { isEqual } = require('../../utilities');

// Retrieves `operationSummary`
// This is all `actions`, included nested ones as a nice formatted string,
// e.g. 'findModel{attrA,attrB,child{attrC}}'
const getOperationSummary = function ({ actions, top: { commandPath } }) {
  const operationSummary = getSummary({ actions, commandPath });
  return { operationSummary };
};

const getSummary = function ({ actions, commandPath: path }) {
  const commandName = path[path.length - 1];

  const childActions = actions
    .filter(({ commandPath }) => isEqual(path, commandPath.slice(0, -1)));

  if (childActions.length === 0) { return commandName; }

  const childActionsStr = childActions
    .map(({ commandPath }) => getSummary({ actions, commandPath }))
    .join(',');
  const operationSummary = `${commandName}{${childActionsStr}}`;

  return operationSummary;
};

module.exports = {
  getOperationSummary,
};
