'use strict';

const { isEqual } = require('../../../utilities');
const { getCommand } = require('../../../constants');

// Retrieve `currentData` for `delete` and `patch` by running `find` commands.
// Also adds `dataPaths` since we'll now know the length of each array of models
const serialResolve = async function ({ actions, mInput }, nextLayer) {
  const writeActions = actions.map(getReadAction);

  // Reuse main `find` command middleware
  const mInputA = {
    ...mInput,
    actions: writeActions,
    actionsGroupType: 'read',
  };
  const { results } = await nextLayer(mInputA, 'sequencer');

  const actionsA = actions.map(action => mergeResult({ results, action }));
  return { actions: actionsA };
};

// Transform to `find` command, while reusing `args.filter`
const getReadAction = function ({ command: { multiple }, ...action }) {
  const command = getCommand({ commandType: 'find', multiple });
  return { ...action, command };
};

// Add `action.currentData`
const mergeResult = function ({ results, action, action: { args } }) {
  const resultsA = results.filter(result => resultMatches({ result, action }));
  const actionA = getAction({ results: resultsA, action, args });
  return actionA;
};

// Retrieve the relevant `results` for this specific action
const resultMatches = function ({ result: { path }, action: { commandPath } }) {
  const pathA = removeIndexes({ path });
  return isEqual(commandPath, pathA);
};

const removeIndexes = function ({ path }) {
  return path.filter(index => typeof index !== 'number');
};

// Transform `results` into `action.currentData` and `action.dataPaths`
const getAction = function ({ results, action }) {
  const dataPaths = results.map(({ path }) => path);
  const currentData = results.map(({ model }) => model);

  return { ...action, currentData, dataPaths };
};

module.exports = {
  serialResolve,
};
