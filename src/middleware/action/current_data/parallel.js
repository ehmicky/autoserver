'use strict';

const {
  flatten,
  groupBy,
  groupValuesBy,
  mapValues,
} = require('../../../utilities');
const { mergeCommandpaths } = require('../../../constants');
const { getSimpleFilter } = require('../../../filter');

// Add `action.currentData` for `create` and `upsert` commands
const parallelResolve = async function ({ actions, mInput }, nextLayer) {
  const { currentDataMap, metadata } = await getCurrentDataMap({
    actions,
    nextLayer,
    mInput,
  });
  const actionsA = addCurrentDataActions({ actions, currentDataMap });
  return { actions: actionsA, metadata };
};

// Fire the `find` commands, in parallel, to retrieve `currentData`
const getCurrentDataMap = async function ({ actions, nextLayer, mInput }) {
  const actionsA = groupActions({ actions });
  const mInputA = { ...mInput, actions: actionsA };

  const { results, metadata } = await nextLayer(mInputA, 'read');

  const currentDataMap = groupBy(results, 'collname');
  const currentDataMapA = mapValues(currentDataMap, getModels);
  return { currentDataMap: currentDataMapA, metadata };
};

// Group write actions on the same model into single read action
const groupActions = function ({ actions }) {
  const actionsGroups = groupValuesBy(actions, 'collname');
  const actionsA = actionsGroups.map(mergeActionsGroups);
  return actionsA;
};

const mergeActionsGroups = function (actions) {
  const commandpath = mergeCommandpaths({ actions });
  const args = getArgs({ actions });
  const [{ collname }] = actions;

  return { commandpath: [commandpath], args, collname };
};

// `args.data` becomes `args.filter`
const getArgs = function ({ actions }) {
  const ids = getIds({ actions });
  const filter = getSimpleFilter({ ids });
  return { filter };
};

const getIds = function ({ actions }) {
  const dataA = actions.map(({ args: { data } }) => data);
  const dataB = flatten(dataA);
  const ids = dataB.map(({ id }) => id);
  return ids;
};

const getModels = function (results) {
  return results.map(({ model }) => model);
};

// Add `action.currentData`
const addCurrentDataActions = function ({ actions, currentDataMap }) {
  return actions
    .map(action => addCurrentDataAction({ action, currentDataMap }));
};

const addCurrentDataAction = function ({
  action,
  action: { collname, args: { data } },
  currentDataMap,
}) {
  const currentData = currentDataMap[collname];
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
