'use strict';

const { isEqual } = require('lodash');

const { getCommand } = require('../../../constants');
const { resolveReadActions } = require('../read_actions');

// Retrieve `currentData` for `delete` and `patch` by running `find` commands.
// Also adds `dataPaths` since we'll now know the length of each array of models
const serialResolve = async function (
  { actions, top, schema, mInput },
  nextLayer,
) {
  const writeActions = getWriteActions({ actions });

  // Reuse main `find` command middleware
  const { results } = await resolveReadActions(
    { actions: writeActions, top, schema, mInput },
    nextLayer,
  );

  const actionsA = actions
    .map(action => mergeSerialResult({ results, action }));
  return { actions: actionsA };
};

// Retrieve the `find` commands to fire
const getWriteActions = function ({ actions }) {
  return actions
    .filter(({ command }) => command.type !== 'find')
    .map(getSerialReadAction);
};

// Reuse `delete` and `patch` arguments for the `find` commands
const getSerialReadAction = function ({ command: { multiple }, ...action }) {
  const command = getCommand({ commandType: 'find', multiple });

  // The command is `internal`, e.g. it bypasses authorization.
  // Actual authorization will be performed with the main commands.
  return { ...action, command, internal: true };
};

// Add `action.currentData`
const mergeSerialResult = function ({
  results,
  action,
  action: { command: { type: commandType }, args },
}) {
  // Only `update` and `delete` commands will have had `currentData` commands
  // fired
  if (commandType === 'find') { return action; }

  const resultsA = findSerialResults({ results, action });
  const actionA = getSerialAction({ results: resultsA, action, args });
  return actionA;
};

// Retrieve the relevant `results` for this specific action
const findSerialResults = function ({ results, action }) {
  return results
    .filter(result => serialResultMatches({ result, action }));
};

const serialResultMatches = function ({
  result: { path },
  action: { commandPath },
}) {
  const pathA = removeIndexes({ path });
  return isEqual(commandPath, pathA);
};

const removeIndexes = function ({ path }) {
  return path.filter(index => typeof index !== 'number');
};

// Transform `results` into `action.currentData` and `action.dataPaths`
const getSerialAction = function ({ results, action }) {
  const dataPaths = results.map(({ path }) => path);
  const currentData = results.map(({ model }) => model);

  return { ...action, currentData, dataPaths };
};

module.exports = {
  serialResolve,
};
