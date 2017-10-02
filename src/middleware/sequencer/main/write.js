'use strict';

const { isEqual } = require('lodash');

const { throwError } = require('../../../error');
const { assignArray, pick, mergeArrayReducer } = require('../../../utilities');
const { COMMANDS } = require('../../../constants');

const sequenceWrite = async function (
  { actionsGroups, top, mInput },
  nextLayer,
) {
  // Run write commands in parallel
  const resultsPromises = actionsGroups.map(actions => singleSequenceWrite({
    actions,
    top,
    nextLayer,
    mInput,
  }));
  const results = await Promise.all(resultsPromises);
  const resultsA = results.reduce(assignArray, []);
  return { results: resultsA };
};

const singleSequenceWrite = async function ({
  actions,
  actions: [{ modelName }],
  top: {
    command,
    command: { type: commandType },
    args: topArgs,
  },
  nextLayer,
  mInput,
}) {
  const { [commandType]: handler } = handlers;
  const args = handler.mergeArgs({ actions });
  const argsA = applyTopArgs({ args, topArgs });

  const ids = handler.getIds({ args: argsA });
  if (ids.length === 0) { return []; }

  const argsB = handler.getCurrentData({ actions, args: argsA, ids });
  const commandPath = mergeCommandPaths({ actions });
  const commandA = findCommand({ command });

  const mInputA = {
    ...mInput,
    action: command,
    commandPath,
    command: commandA,
    modelName,
    args: argsB,
  };
  const { response: { data: results } } = await nextLayer(mInputA);

  const resultsA = getResults({ actions, results, ids, modelName });
  return resultsA;
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
  const modelsA = models.reduce(assignArray, []);
  modelsA.forEach(validateId);

  const modelsB = modelsA.reduce(mergeArrayReducer('id'), {});
  return Object.values(modelsB).map(getUniqueModel);
};

const validateId = function (model) {
  if (typeof model.id === 'string') { return; }

  const message = `A model in 'data' is missing an 'id' attribute: '${JSON.stringify(model)}'`;
  throwError(message, { reason: 'INPUT_VALIDATION' });
};

const getUniqueModel = function (models) {
  const [model] = models;
  validateDuplicates(models, model);
  return model;
};

const validateDuplicates = function (models, model) {
  const differentModel = models
    .slice(1)
    .find(modelA => !isEqual(modelA, model));
  if (differentModel === undefined) { return; }

  const message = `Two models in 'data' have the same 'id' but different attributes: '${JSON.stringify(model)}', '${JSON.stringify(differentModel)}'`;
  throwError(message, { reason: 'INPUT_VALIDATION' });
};

const applyTopArgs = function ({ args, topArgs }) {
  const topArgsA = pick(topArgs, ['dryrun']);
  return { ...args, ...topArgsA };
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
  patch: dataHandler,
  replace: dataHandler,
  delete: filterHandler,
};

const mergeCommandPaths = function ({ actions }) {
  return actions
    .reduce(
      (commandPaths, { commandPath }) => [...commandPaths, commandPath.join('.')],
      [],
    )
    .join(', ');
};

const findCommand = function ({ command }) {
  const { type } = COMMANDS.find(COMMAND => command === COMMAND);
  return type;
};

const getResults = function ({ actions, results, ids, modelName }) {
  validateResult({ ids, results });

  return actions
    .map(getModels.bind(null, { results, modelName }))
    .reduce(assignArray, []);
};

const getModels = function (
  { results, modelName },
  { args, currentData, dataPaths, select },
) {
  const models = args.data || currentData;
  return models
    .map(findModel.bind(null, { results, dataPaths, select, modelName }))
    .filter(({ path }) => path !== undefined);
};

const findModel = function (
  { results, dataPaths, select, modelName },
  { id },
  index,
) {
  const model = results.find(result => result.id === id);
  const path = dataPaths[index];
  return { path, model, modelName, select };
};

// Safety check to make sure there is no server-side bugs
const validateResult = function ({ ids, results }) {
  const sameLength = results.length === ids.length;

  if (!sameLength) {
    const message = `'ids' and 'results' do not have the same length`;
    throwError(message, { reason: 'UTILITY_ERROR' });
  }
};

module.exports = {
  sequenceWrite,
};
