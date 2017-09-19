'use strict';

const { throwError } = require('../../../../../error');
const { assignArray } = require('../../../../../utilities');

const resolveWrite = async function ({ actions, nextLayer, mInput }) {
  const responsesPromises = actions
    .map(action => resolveWriteAction({ action, nextLayer, mInput }));
  const responses = await Promise.all(responsesPromises);
  const responsesA = responses.reduce(assignArray, []);
  return responsesA;
};

const resolveWriteAction = async function ({
  action: { actionConstant, actionPath, modelName, args, select, dataPaths },
  nextLayer,
  mInput,
}) {
  const responses = getResponses({ dataPaths, args });

  const mInputA = {
    ...mInput,
    action: actionConstant,
    actionPath,
    modelName,
    args,
  };
  const { response: { data } } = await nextLayer(mInputA);

  const responsesA = responses
    .map(response => addResponsesModel({ response, data, select }));
  return responsesA;
};

const getResponses = function ({ dataPaths, args: { data } }) {
  return dataPaths
    .map((path, index) => getResponse({ path, data: data[index] }));
};

const getResponse = function ({ path, data: { id } }) {
  if (typeof id !== 'string') {
    const errorPath = path.slice(1).join('.');
    const message = `The model at 'data.${errorPath} is missing an 'id' attribute.`;
    throwError(message, { reason: 'INPUT_VALIDATION' });
  }

  return { id, path };
};

const addResponsesModel = function ({
  response: { id, ...rest },
  data,
  select,
}) {
  const model = data.find(datum => datum.id === id);
  return { model, select, ...rest };
};

module.exports = {
  resolveWrite,
};
