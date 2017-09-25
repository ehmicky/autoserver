'use strict';

const { uniq } = require('lodash');

const { assignArray } = require('../../../../../utilities');
const { getActionConstant } = require('../utilities');

const parallelResolve = async function ({
  actions: allActions,
  nextLayer,
  otherLayer,
  mInput,
}) {
  const actionsGroups = getWriteActions({ allActions });
  const actions = writeToRead(actionsGroups);
  const currentDataMap = await getCurrentDataMap({
    actions,
    nextLayer,
    otherLayer,
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
    .filter(({ actionConstant }) => actionConstant.type !== 'find');
  const writeActionsB = writeActionsA.reduce(getWriteAction, {});
  const writeActionsC = Object.values(writeActionsB);
  return writeActionsC;
};

const getWriteAction = function (writeActions, action) {
  const { modelName } = action;
  const { [modelName]: actionsByModel = [] } = writeActions;
  const actionsByModelA = [...actionsByModel, action];
  return { ...writeActions, [action.modelName]: actionsByModelA };
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
  const actionPath = mergeActionPaths({ actions });
  const [{ modelName, actionConstant }] = actions;
  const idCheck = actionConstant.type !== 'upsert';

  return {
    actionPath: [actionPath],
    actionConstant: readAction,
    args,
    modelName,
    idCheck,
    internal: true,
  };
};

const mergeActionPaths = function ({ actions }) {
  return actions
    .reduce(
      (actionPaths, { actionPath }) => [...actionPaths, actionPath.join('.')],
      [],
    )
    .join(', ');
};

const readAction = getActionConstant({ actionType: 'find', isArray: true });

const getCurrentDataMap = async function ({
  actions,
  nextLayer,
  otherLayer,
  mInput,
}) {
  const actionsA = actions.map(parentAction => ({ parentAction }));
  const responses = await otherLayer({
    actionsGroupType: 'read',
    actions: actionsA,
    nextLayer,
    mInput,
  });

  const currentDataMap = responses.reduce(reduceCurrentDataMap, {});
  return currentDataMap;
};

const reduceCurrentDataMap = function (currentDataMap, { model, modelName }) {
  const { [modelName]: models = [] } = currentDataMap;
  const modelsA = [...models, model];
  return { ...currentDataMap, [modelName]: modelsA };
};

const addCurrentDataActions = function ({ actions, currentDataMap }) {
  return actions.map(addCurrentDataAction.bind(null, currentDataMap));
};

const addCurrentDataAction = function (currentDataMap, action) {
  const { modelName, args: { data } } = action;

  if (data === undefined) { return; }

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
