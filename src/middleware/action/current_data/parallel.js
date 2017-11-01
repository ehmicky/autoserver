'use strict';

const {
  assignArray,
  groupBy,
  groupValuesBy,
  mapValues,
} = require('../../../utilities');
const { getCommand, mergeCommandPaths } = require('../../../constants');
const { getSimpleFilter } = require('../../../filter');

// Add `action.currentData` for `replace` commands
const parallelResolve = async function ({ actions, mInput }, nextLayer) {
  const currentDataMap = await getCurrentDataMap({
    actions,
    nextLayer,
    mInput,
  });
  const actionsA = addCurrentDataActions({ actions, currentDataMap });
  return { actions: actionsA };
};

// Fire the `find` commands, in parallel, to retrieve `currentData`
const getCurrentDataMap = async function ({ actions, nextLayer, mInput }) {
  const actionsA = groupActions({ actions });
  const mInputA = { ...mInput, actions: actionsA };
  const { results } = await nextLayer(mInputA, 'read');

  // Group `currentData` by model
  const currentDataMap = groupBy(results, 'modelName');
  const currentDataMapA = mapValues(currentDataMap, mapCurrentDataModel);
  return currentDataMapA;
};

// Group write actions on the same model into single read action
const groupActions = function ({ actions }) {
  const actionsGroups = groupValuesBy(actions, 'modelName');
  const actionsA = actionsGroups.map(mergeActionsGroups);
  return actionsA;
};

// `args.data` becomes `args.filter`
const mergeActionsGroups = function (actions) {
  const commandPath = mergeCommandPaths({ actions });
  const ids = getIds({ actions });
  const filter = getSimpleFilter({ ids });
  const args = { filter };
  const [{ modelName }] = actions;

  return { commandPath: [commandPath], command: readCommand, args, modelName };
};

const getIds = function ({ actions }) {
  return actions
    .map(({ args: { data } }) => data)
    .reduce(assignArray, [])
    .map(({ id }) => id);
};

const readCommand = getCommand({ commandType: 'find', multiple: true });

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
