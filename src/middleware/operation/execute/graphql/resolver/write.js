'use strict';

const resolveWrite = function ({ actions, nextLayer, mInput }) {
  const actionsPromises = actions
    .map(action => resolveWriteAction({ action, nextLayer, mInput }));
  return Promise.all(actionsPromises);
};

const resolveWriteAction = async function ({
  action,
  action: { actionConstant, actionPath, modelName, args },
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
  const { response: { data: response } } = await nextLayer(mInputA);

  return { ...action, response };
};

module.exports = {
  resolveWrite,
};
