'use strict';

const {
  assignArray,
  groupBy,
  groupValuesBy,
  mapValues,
} = require('../../../utilities');
const { getCommand } = require('../../../constants');
const { getSimpleFilter } = require('../../../filter');
const { mergeCommandPaths } = require('../command_paths');

// Add `action.currentData` for `replace` commands
const parallelResolve = async function ({ actions, mInput }, nextLayer) {
  const actionsGroups = groupValuesBy(actions, 'modelName');
  const actionsGroupsA = mergeCommandPaths({ actionsGroups });
  const writeActions = actionsGroupsA.map(normalizeActionsGroup);
  const currentDataMap = await getCurrentDataMap({
    writeActions,
    nextLayer,
    mInput,
  });
  const actionsA = addCurrentDataActions({ actions, currentDataMap });
  return { actions: actionsA };
};

// `args.data` becomes `args.filter`
const normalizeActionsGroup = function (actions) {
  const [{ commandPath }] = actions;
  const ids = actions
    .map(({ args: { data } }) => data)
    .reduce(assignArray, [])
    .map(({ id }) => id);
  const filter = getSimpleFilter({ ids });
  const args = { filter };
  const [{ modelName }] = actions;

  return { commandPath: [commandPath], command: readCommand, args, modelName };
};

const readCommand = getCommand({ commandType: 'find', multiple: true });

// Fire the `find` commands, in parallel, to retrieve `currentData`
const getCurrentDataMap = async function ({ writeActions, nextLayer, mInput }) {
  const mInputA = { ...mInput, actions: writeActions };
  const { results } = await nextLayer(mInputA, 'read');

  // Group `currentData` by model
  const currentDataMap = groupBy(results, 'modelName');
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
