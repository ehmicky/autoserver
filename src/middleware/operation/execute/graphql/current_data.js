'use strict';

const { uniq, isEqual } = require('lodash');

const { throwError } = require('../../../../error');
const { assignArray, reduceAsync, omit } = require('../../../../utilities');

const { getTopLevelAction, getActionConstant } = require('./utilities');

const addCurrentData = function ({
  actions,
  nextLayer,
  otherLayer,
  mInput,
  topArgs,
}) {
  const {
    actionConstant: { type: actionType },
  } = getTopLevelAction({ actions });
  const resolver = resolvers[actionType];

  if (resolver === undefined) { return actions; }

  return resolver({ actions, nextLayer, otherLayer, mInput, topArgs });
};

const parallelResolve = async function ({
  actions: allActions,
  nextLayer,
  otherLayer,
  mInput,
  topArgs,
}) {
  const actionsGroups = getWriteActions({ allActions });
  const actions = writeToRead(actionsGroups);
  const currentDataPromises = actions.map(
    fireParallelRead.bind(null, { nextLayer, otherLayer, mInput, topArgs })
  );
  const currentDataMap = await Promise.all(currentDataPromises);
  const currentDataMapA = Object.assign({}, ...currentDataMap);
  const actionsA = addCurrentDataActions({
    actions: allActions,
    currentDataMap: currentDataMapA,
  });
  return actionsA;
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

const currentDataMatches = function ({ id, currentData }) {
  return currentData.find(model => model.id === id);
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
  const [{ modelName }] = actions;

  return {
    actionPath: [actionPath],
    actionConstant: readAction,
    args,
    modelName,
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

const fireParallelRead = async function (
  { nextLayer, otherLayer, mInput, topArgs },
  action,
) {
  const { modelName } = action;
  const responses = await otherLayer({
    actionsGroupType: 'read',
    actions: [action],
    nextLayer,
    mInput,
    topArgs,
  });
  const models = responses.map(({ model }) => model);
  return { [modelName]: models };
};

const serialResolve = async function ({
  actions,
  nextLayer,
  otherLayer,
  mInput,
  topArgs,
}) {
  const writeActions = actions
    .filter(({ actionConstant }) => actionConstant.type !== 'find');
  const responses = await reduceAsync(
    writeActions,
    fireSerialRead.bind(null, { nextLayer, otherLayer, mInput, topArgs }),
    [],
  );
  const actionsA = actions
    .map(action => mergeSerialResponse({ responses, action }));
  return actionsA;
};

const fireSerialRead = async function (
  { nextLayer, otherLayer, mInput, topArgs },
  responses,
  action,
) {
  const actions = getSerialReadActions({ action });

  const responsesA = await otherLayer({
    actionsGroupType: 'read',
    actions,
    nextLayer,
    mInput,
    topArgs,
    responses,
  });
  return [...responses, ...responsesA];
};

const getSerialReadActions = function ({ action, action: { args } }) {
  const argsA = omit(args, 'data');

  return [{
    ...action,
    actionConstant: readAction,
    args: argsA,
  }];
};

const mergeSerialResponse = function ({
  responses,
  action,
  action: { actionConstant, args },
}) {
  if (actionConstant.type === 'find') { return action; }

  const responsesA = findSerialResponses({ responses, action });
  const actionA = getSerialAction({ responses: responsesA, action, args });
  return actionA;
};

const findSerialResponses = function ({ responses, action }) {
  return responses
    .filter(response => serialResponseMatches({ response, action }));
};

const serialResponseMatches = function ({
  response: { path },
  action: { actionPath },
}) {
  const pathA = removeIndexes({ path });
  return isEqual(actionPath, pathA);
};

const removeIndexes = function ({ path }) {
  return path.filter(index => typeof index !== 'number');
};

const getSerialAction = function ({ responses, action, args }) {
  const dataPaths = responses.map(({ path }) => path);
  const currentData = responses.map(({ model }) => model);
  const argsA = mergeData({ args, currentData });

  return { ...action, currentData, dataPaths, args: argsA };
};

// Merge current models with the data we want to update,
// to obtain the final models we want to use as replacement
const mergeData = function ({ args: { data }, currentData }) {
  const [newData] = data;
  const newDataA = currentData
    .map(currentDatum => ({ ...currentDatum, ...newData }));
  return { data: newDataA };
};

const resolvers = {
  replace: parallelResolve,
  upsert: parallelResolve,
  update: serialResolve,
  delete: serialResolve,
};

module.exports = {
  addCurrentData,
};
