'use strict';

// Merge each action `commandPath` into a comma-separated list
const mergeCommandPaths = function ({ actionsGroups }) {
  return actionsGroups.map(actions => mergeCommandPathsActions({ actions }));
};

const mergeCommandPathsActions = function ({ actions }) {
  const commandPath = getCommandPaths({ actions });
  return actions.map(action => ({ ...action, commandPath }));
};

const getCommandPaths = function ({ actions }) {
  return actions
    .reduce((paths, { commandPath }) => [...paths, commandPath.join('.')], [])
    .join(', ');
};

module.exports = {
  mergeCommandPaths,
};
