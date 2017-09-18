'use strict';

const resolveWrite = function ({ actions, nextLayer, mInput }) {
  const actionsPromises = actions
    .map(action => resolveWriteAction({ action, nextLayer, mInput }));
  return Promise.all(actionsPromises);
};

const resolveWriteAction = async function ({
  action,
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

  const responsesA = responses
    .map(response => addResponsesModel({ response, data }));
  return { ...action, responses: responsesA };
};

const addResponsesModel = function ({ response: { id, ...rest }, data }) {
  const model = data.find(datum => datum.id === id);
  return { model, ...rest };
};

module.exports = {
  resolveWrite,
};
