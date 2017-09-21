'use strict';

const { throwError } = require('../../../../../error');
const { assignArray } = require('../../../../../utilities');

const resolveWrite = async function ({
  actions,
  actions: [{ actionConstant, modelName }],
  nextLayer,
  mInput,
}) {
  const argsA = mergeArgs({ actions });
  if (argsA.data.length === 0) { return []; }

  const actionPathA = mergeActionPaths({ actions });
  const dataPathsA = mergeDataPaths({ actions });

  const mInputA = {
    ...mInput,
    action: actionConstant,
    actionPath: actionPathA,
    modelName,
    args: argsA,
  };
  const { response: { data } } = await nextLayer(mInputA);

  const responses = dataPathsA.map(addResponsesModel.bind(null, data));
  return responses;
};

const mergeArgs = function ({ actions }) {
  const data = actions
    .map(({ args }) => args.data)
    .reduce(assignArray, [])
    .filter(isDuplicate);
  return { data };
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
