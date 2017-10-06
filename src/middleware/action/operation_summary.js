'use strict';

const { isEqual } = require('lodash');

// Retrieves `operationSummary`
// This is all `actions`, included nested ones as a nice formatted string,
// e.g. 'findModel{attrA,attrB,child{attrC}}'
const getOperationSummary = function ({
  actions,
  top,
  top: { command: { type: commandType }, commandPath: topCommandPath },
  commandPath = topCommandPath,
}) {
  const commandName = commandPath[commandPath.length - 1];

  const childActions = actions.filter(({ commandPath: childPath, command }) =>
    isEqual(commandPath, childPath.slice(0, -1)) &&
    // In write actions, do not use child actions only used for selections
    command.type === commandType);

  if (childActions.length === 0) {
    return { operationSummary: commandName };
  }

  const childActionsStr = childActions
    .map(({ commandPath: childPath }) => getOperationSummary({
      commandPath: childPath,
      actions,
      top,
    }).operationSummary)
    .join(',');
  const operationSummary = `${commandName}{${childActionsStr}}`;

  return { operationSummary };
};

module.exports = {
  getOperationSummary,
};
