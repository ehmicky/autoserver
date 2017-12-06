'use strict';

const { isEqual } = require('../../utilities');

// Retrieves `summary`
// This is all `actions`, included nested ones as a nice formatted string,
// e.g. 'find_collection{attrA,attrB,child{attrC}}'
// Also retrieves `commandpaths` and `collnames`
const getSummary = function ({ actions, top, top: { commandpath } }) {
  const summary = getEachSummary({ actions, commandpath, top });
  const commandpaths = getCommandpaths({ actions });
  const collnames = getCollnames({ actions });
  return { summary, commandpaths, collnames };
};

const getEachSummary = function ({ actions, commandpath: path, top }) {
  const commandName = getCommandName({ path, top });

  const childActions = actions.filter(({ commandpath }) =>
    commandpath.length !== 0 && isEqual(path, commandpath.slice(0, -1)));

  if (childActions.length === 0) { return commandName; }

  const childActionsStr = childActions
    .map(({ commandpath }) => getEachSummary({ actions, commandpath, top }))
    .join(',');
  const summary = `${commandName}{${childActionsStr}}`;

  return summary;
};

const getCommandName = function ({ path, top: { clientCollname, command } }) {
  return path.length === 0
    ? `${command.type}_${clientCollname}`
    : path[path.length - 1];
};

// List of all actions's `commandpath`
const getCommandpaths = function ({ actions }) {
  return actions.map(({ commandpath }) => commandpath.join('.'));
};

// List of all actions's `collname`
const getCollnames = function ({ actions }) {
  return actions.map(({ collname }) => collname);
};

module.exports = {
  getSummary,
};
