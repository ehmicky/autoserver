'use strict';

const { uniq } = require('lodash');

const {
  assignArray,
  mergeArrayReducer,
  mapValues,
} = require('../../../utilities');
const { getCommand } = require('../../../constants');

const parallelResolve = async function (
  { actions: allActions, mInput },
  nextLayer,
) {
  const actionsGroups = getWriteActions({ allActions });
  const actions = writeToRead(actionsGroups);
  const currentDataMap = await getCurrentDataMap({
    actions,
    nextLayer,
    mInput,
  });
  const actionsA = addCurrentDataActions({
    actions: allActions,
    currentDataMap,
  });
  return actionsA;
};

const getWriteActions = function ({ allActions }) {
  const writeActionsA = allActions
    .filter(({ command }) => command.type !== 'find');
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

const writeToReadAction = function (actions) {
  const ids = actions
    .map(({ args: { data } }) => data)
    .reduce(assignArray, [])
    .map(({ id }) => id);
  const idsA = uniq(ids);
  const args = { filter: { id: idsA } };
  const commandPath = mergeCommandPaths({ actions });
  const [{ modelName }] = actions;

  return {
    commandPath: [commandPath],
    command: readCommand,
    args,
    modelName,
    internal: true,
  };
};

const mergeCommandPaths = function ({ actions }) {
  return actions
    .reduce(
      (commandPaths, { commandPath }) => [...commandPaths, commandPath.join('.')],
      [],
    )
    .join(', ');
};

const readCommand = getCommand({ commandType: 'find', multiple: true });

const getCurrentDataMap = async function ({ actions, nextLayer, mInput }) {
  const actionsA = actions.map(parentAction => ({ parentAction }));
  const { results } = await nextLayer({
    ...mInput,
    actionsGroupType: 'read',
    actions: actionsA,
  });

  const currentDataMap = results.reduce(mergeArrayReducer('modelName'), {});
  const currentDataMapA = mapValues(currentDataMap, mapCurrentDataModel);
  return currentDataMapA;
};

const mapCurrentDataModel = function (results) {
  return results.map(({ model }) => model);
};

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
