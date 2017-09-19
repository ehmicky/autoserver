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
  action: { actionConstant, actionPath, modelName, args, responses },
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

  return responses.map(response => addResponsesModel({ response, data }));
};

const addResponsesModel = function ({ response: { id, ...rest }, data }) {
  const model = data.find(datum => datum.id === id);
  return { model, ...rest };
};

module.exports = {
  resolveWrite,
};
