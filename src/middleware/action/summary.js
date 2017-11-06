'use strict';

const { isEqual } = require('../../utilities');

// Retrieves `summary`
// This is all `actions`, included nested ones as a nice formatted string,
// e.g. 'findModel{attrA,attrB,child{attrC}}'
const getSummary = function ({ actions, top: { commandPath } }) {
  const summary = getEachSummary({ actions, commandPath });
  return { summary };
};

const getEachSummary = function ({ actions, commandPath: path }) {
  const commandName = path[path.length - 1];

  const childActions = actions
    .filter(({ commandPath }) => isEqual(path, commandPath.slice(0, -1)));

  if (childActions.length === 0) { return commandName; }

  const childActionsStr = childActions
    .map(({ commandPath }) => getEachSummary({ actions, commandPath }))
    .join(',');
  const summary = `${commandName}{${childActionsStr}}`;

  return summary;
};

module.exports = {
  getSummary,
};
