'use strict';

const { uniq } = require('lodash');

const {
  assignArray,
  mergeArrayReducer,
  mapValues,
} = require('../../../utilities');
const { getCommand } = require('../../../constants');
const { mergeCommandPaths } = require('../command_paths');

// Add `action.currentData` for `replace` commands
const parallelResolve = async function ({ actions, mInput }, nextLayer) {
  const actionsGroups = getWriteActions({ actions });
  const actionsGroupsA = mergeCommandPaths({ actionsGroups });
  const writeActions = writeToRead(actionsGroupsA);
  const currentDataMap = await getCurrentDataMap({
    writeActions,
    nextLayer,
    mInput,
  });
  const actionsA = addCurrentDataActions({ actions, currentDataMap });
  return actionsA;
};

// Retrieve the `find` commands to perform, by using current `replace` actions
const getWriteActions = function ({ actions }) {
  const writeActionsA = actions
    .filter(({ command }) => command.type !== 'find');
  // Group commands by model
  const writeActionsB = writeActionsA.reduce(
    mergeArrayReducer('modelName'),
    {},
  );
  const writeActionsC = Object.values(writeActionsB);
  return writeActionsC;
};

const writeToRead = function (actionsGroups) {
  return actionsGroups.map(writeToReadAction);
};

// Transform a `replace` command into a `find` command.
// `args.data` becomes `args.filter`
const writeToReadAction = function (actions) {
  const [{ commandPath }] = actions;
  const ids = actions
    .map(({ args: { data } }) => data)
    .reduce(assignArray, [])
    .map(({ id }) => id);
  const idsA = uniq(ids);
  const args = { filter: { id: idsA } };
  const [{ modelName }] = actions;

  return {
    commandPath: [commandPath],
    command: readCommand,
    args,
    modelName,
    internal: true,
  };
};

const readCommand = getCommand({ commandType: 'find', multiple: true });

// Fire the `find` commands, in parallel, to retrieve `currentData`
const getCurrentDataMap = async function ({ writeActions, nextLayer, mInput }) {
  const actions = writeActions.map(parentAction => ({ parentAction }));
  const actionsGroupType = 'read';
  const { results } = await nextLayer({ ...mInput, actionsGroupType, actions });

  // Group `currentData` by model
  const currentDataMap = results.reduce(mergeArrayReducer('modelName'), {});
  const currentDataMapA = mapValues(currentDataMap, mapCurrentDataModel);
  return currentDataMapA;
};

const mapCurrentDataModel = function (results) {
  return results.map(({ model }) => model);
};

// Add `action.currentData`
const addCurrentDataActions = function ({ actions, currentDataMap }) {
  return actions
    .map(action => addCurrentDataAction({ action, currentDataMap }));
};

const addCurrentDataAction = function ({
  action,
  action: { modelName, args: { data } },
  currentDataMap,
}) {
  if (data === undefined) { return action; }

  const currentData = currentDataMap[modelName];
  const currentDataA = data
    .map(({ id }) => currentDataMatches({ id, currentData }));
  return { ...action, currentData: currentDataA };
};

const currentDataMatches = function ({ id, currentData = [] }) {
  return currentData.find(model => model.id === id);
};

module.exports = {
  parallelResolve,
};
