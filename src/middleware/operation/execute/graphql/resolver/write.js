'use strict';

const { assignArray } = require('../../../../../utilities');

const resolveWrite = async function ({ actions, nextLayer, mInput }) {
  const responsesPromises = actions
    .map(action => resolveWriteAction({ action, nextLayer, mInput }));
  const responses = await Promise.all(responsesPromises);
  const responsesA = responses.reduce(assignArray, []);
  return responsesA;
};

const resolveWriteAction = async function ({
  action: { actionConstant, actionPath, modelName, args, responses, select },
  nextLayer,
  mInput,
}) {
  const mInputA = {
    ...mInput,
    action: actionConstant,
    actionPath,
    modelName,
    args,
  };
  const { response: { data } } = await nextLayer(mInputA);

  return responses
    .map(response => addResponsesModel({ response, data, select }));
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
