'use strict';

const { isEqual } = require('../../utilities');

// Retrieves `summary`
// This is all `actions`, included nested ones as a nice formatted string,
// e.g. 'collection{attrA,attrB,child{attrC}}'
// Also retrieves `commandpaths`
const getSummary = function ({ actions, top: { commandpath } }) {
  const summary = getEachSummary({ actions, commandpath });
  const commandpaths = getCommandpaths({ actions });
  return { summary, commandpaths };
};

const getEachSummary = function ({ actions, commandpath: path }) {
  const commandName = path[path.length - 1];

  const childActions = actions
    .filter(({ commandpath }) => isEqual(path, commandpath.slice(0, -1)));

  if (childActions.length === 0) { return commandName; }

  const childActionsStr = childActions
    .map(({ commandpath }) => getEachSummary({ actions, commandpath }))
    .join(',');
  const summary = `${commandName}{${childActionsStr}}`;

  return summary;
};

const getCommandpaths = function ({ actions }) {
  return actions.map(({ commandpath }) => commandpath.join('.'));
};

module.exports = {
  getSummary,
};
