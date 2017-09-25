'use strict';

const { throwError } = require('../../../../../error');
const { assignArray } = require('../../../../../utilities');
const { ACTIONS } = require('../../../../../constants');

const resolveWrite = async function ({
  actions,
  actions: [{
    actionConstant,
    actionConstant: { type: actionType },
    modelName,
  }],
  nextLayer,
  mInput,
}) {
  const { [actionType]: handler } = handlers;
  const argsA = handler.mergeArgs({ actions });

  const ids = handler.getIds({ args: argsA });
  if (ids.length === 0) { return []; }

  const argsB = handler.getCurrentData({ actions, args: argsA, ids });
  const actionPath = mergeActionPaths({ actions });
  const command = findCommand({ actionConstant });

  const mInputA = {
    ...mInput,
    action: actionConstant,
    actionPath,
    command,
    modelName,
    args: argsB,
  };
  const { response: { data: responses } } = await nextLayer(mInputA);

  const responsesA = getResponses({ actions, responses, ids });
  return responsesA;
};

const mergeDataArgs = function ({ actions }) {
  const newData = actions.map(action => action.args.data);
  const newDataA = removeDuplicates(newData);

  return { newData: newDataA };
};

const mergeFilterArgs = function ({ actions }) {
  const models = actions.map(({ currentData }) => currentData);
  const modelsA = removeDuplicates(models);
  const ids = modelsA.map(({ id }) => id);
  return { filter: { id: ids } };
};

const removeDuplicates = function (models) {
  return models
    .reduce(assignArray, [])
    .filter(isDuplicate);
};

// Removes duplicates
const isDuplicate = function (model, index, allData) {
  if (typeof model.id !== 'string') {
    const message = `A model in 'data' is missing an 'id' attribute: '${JSON.stringify(model)}'`;
    throwError(message, { reason: 'INPUT_VALIDATION' });
  }

  return allData
    .slice(0, index)
    .every(({ id }) => id !== model.id);
};

const getFilterIds = function ({ args: { filter: { id } } }) {
  return id;
};

const getDataIds = function ({ args: { newData } }) {
  return newData.map(({ id }) => id);
};

const getCurrentData = function ({ actions, args, ids }) {
  const currentData = actions
    .map(action => action.currentData)
    .reduce(assignArray, []);
  const currentDataA = ids.map(id => findCurrentData({ id, currentData }));

  return { ...args, currentData: currentDataA };
};

const findCurrentData = function ({ id, currentData }) {
  return currentData
    .find(currentDatum => currentDatum && currentDatum.id === id) || null;
};

const createHandler = {
  mergeArgs: mergeDataArgs,
  getIds: getDataIds,
  getCurrentData: ({ args }) => args,
};
const dataHandler = {
  mergeArgs: mergeDataArgs,
  getIds: getDataIds,
  getCurrentData,
};
const filterHandler = {
  mergeArgs: mergeFilterArgs,
  getIds: getFilterIds,
  getCurrentData,
};

const handlers = {
  create: createHandler,
  update: dataHandler,
  upsert: dataHandler,
  replace: dataHandler,
  delete: filterHandler,
};

const mergeActionPaths = function ({ actions }) {
  return actions
    .reduce(
      (actionPaths, { actionPath }) => [...actionPaths, actionPath.join('.')],
      [],
    )
    .join(', ');
};

const findCommand = function ({ actionConstant }) {
  const { command } = ACTIONS.find(action => actionConstant === action);
  return command;
};

const getResponses = function ({ actions, responses, ids }) {
  validateResponse({ ids, responses });

  return actions
    .map(getModels.bind(null, responses))
    .reduce(assignArray, []);
};

const getModels = function (
  responses,
  { args, currentData, dataPaths, select },
) {
  const models = args.data || currentData;
  return models
    .map(findModel.bind(null, { responses, dataPaths, select }))
    .filter(({ path }) => path !== undefined);
};

const findModel = function ({ responses, dataPaths, select }, { id }, index) {
  const model = responses.find(response => response.id === id);
  const path = dataPaths[index];
  return { path, model, select };
};

// Safety check to make sure there is no server-side bugs
const validateResponse = function ({ ids, responses }) {
  const sameLength = responses.length === ids.length;

  if (!sameLength) {
    const message = `'ids' and 'responses' do not have the same length`;
    throwError(message, { reason: 'UTILITY_ERROR' });
  }
};

module.exports = {
  resolveWrite,
};
