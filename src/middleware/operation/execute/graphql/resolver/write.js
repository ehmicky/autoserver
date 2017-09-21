'use strict';

const { throwError } = require('../../../../../error');
const { assignArray } = require('../../../../../utilities');

const resolveWrite = async function ({ actionsGroup, nextLayer, mInput }) {
  const argsA = mergeArgs({ actionsGroup });
  if (argsA.data.length === 0) { return []; }

  const [{ actionConstant, modelName }] = actionsGroup;
  const actionPathA = mergeActionPaths({ actionsGroup });
  const dataPathsA = mergeDataPaths({ actionsGroup });

  const mInputA = {
    ...mInput,
    action: actionConstant,
    actionPath: actionPathA,
    modelName,
    args: argsA,
  };
  const { response: { data } } = await nextLayer(mInputA);

  const responses = dataPathsA
    .map(dataPath => addResponsesModel({ data, ...dataPath }));
  return responses;
};

const mergeArgs = function ({ actionsGroup }) {
  actionsGroup.forEach(({ args }) => validateWriteArgs({ args }));
  const data = actionsGroup
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

const validateWriteArgs = function ({ args }) {
  const argsKeys = Object.keys(args);
  const forbiddenArgs = argsKeys
    .filter(argKey => !allowedArgs.includes(argKey));
  if (forbiddenArgs.length === 0) { return; }

  const message = `Unknown arguments: ${forbiddenArgs.join(', ')}`;
  throwError(message, { reason: 'INPUT_VALIDATION' });
};

const allowedArgs = ['data'];

const mergeActionPaths = function ({ actionsGroup }) {
  return actionsGroup
    .reduce(
      (actionPaths, { actionPath }) => [...actionPaths, actionPath.join('.')],
      [],
    )
    .join(', ');
};

const mergeDataPaths = function ({ actionsGroup }) {
  return actionsGroup
    .map(({ args: { data }, dataPaths, select }) =>
      dataPaths.map((path, index) => ({ path, id: data[index].id, select }))
    )
    .reduce(assignArray, []);
};

const addResponsesModel = function ({ data, path, id, select }) {
  const model = data.find(datum => datum.id === id);
  return { path, model, select };
};

module.exports = {
  resolveWrite,
};
