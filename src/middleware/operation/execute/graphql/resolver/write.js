'use strict';

const { throwError } = require('../../../../../error');
const { assignArray } = require('../../../../../utilities');
const { ACTIONS } = require('../../../../../constants');

const resolveWrite = async function ({
  actions,
  actions: [{ actionConstant, modelName }],
  nextLayer,
  mInput,
  topArgs,
}) {
  const argsA = mergeArgs({ actions, topArgs });
  if (argsA.newData.length === 0) { return []; }

  const argsB = getCurrentData({ actions, args: argsA });
  const actionPathA = mergeActionPaths({ actions });
  const dataPathsA = mergeDataPaths({ actions });
  const { command } = ACTIONS.find(action => actionConstant === action);

  const mInputA = {
    ...mInput,
    action: actionConstant,
    actionPath: actionPathA,
    command,
    modelName,
    args: argsB,
  };
  const { response: { data } } = await nextLayer(mInputA);

  const responses = dataPathsA.map(addResponsesModel.bind(null, data));
  return responses;
};

const getCurrentData = function ({ actions, args, args: { newData } }) {
  const currentData = actions
    .map(action => action.currentData)
    .reduce(assignArray, []);
  const currentDataA = newData
    .map(datum => findCurrentData({ datum, currentData }));
  return { ...args, currentData: currentDataA };
};

const findCurrentData = function ({ datum, currentData }) {
  return currentData.find(currentDatum => currentDatum.id === datum.id);
};

const mergeArgs = function ({ actions, topArgs }) {
  const newData = actions
    .map(({ args: { data: dataA } }) => dataA)
    .reduce(assignArray, [])
    .filter(isDuplicate);
  return { ...topArgs, newData };
};

// Removes duplicates
const isDuplicate = function (model, index, allData) {
  if (typeof model.id !== 'string') {
    const message = `A model in 'data' is missing an 'id' attribute: '${JSON.stringify(model)}'`;
    throwError(message, { reason: 'INPUT_VALIDATION' });
  }

  return allData
    .slice(0, index)
    .every(({ id }) => model.id !== id);
};

const mergeActionPaths = function ({ actions }) {
  return actions
    .reduce(
      (actionPaths, { actionPath }) => [...actionPaths, actionPath.join('.')],
      [],
    )
    .join(', ');
};

const mergeDataPaths = function ({ actions }) {
  return actions
    .map(({ args: { data }, dataPaths, select }) =>
      dataPaths.map((path, index) => ({ path, id: data[index].id, select }))
    )
    .reduce(assignArray, []);
};

const addResponsesModel = function (data, { path, id, select }) {
  const model = data.find(datum => datum.id === id);
  return { path, model, select };
};

module.exports = {
  resolveWrite,
};
