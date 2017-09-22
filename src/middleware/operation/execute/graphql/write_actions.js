'use strict';

const { assignArray } = require('../../../../utilities');

const resolveWriteActions = async function ({
  actions: allActions,
  nextLayer,
  otherLayer,
  mInput,
  topArgs,
}) {
  const writeActions = getWriteActions({ allActions });
  const responsesPromises = writeActions.map(actions => otherLayer({
    actionsGroupType: 'write',
    actions,
    nextLayer,
    mInput,
    topArgs,
  }));
  const responses = await Promise.all(responsesPromises);
  const responsesA = responses.reduce(assignArray, []);
  return responsesA;
};

const getWriteActions = function ({ allActions }) {
  const writeActionsA = allActions
    .filter(({ actionConstant }) => actionConstant.type !== 'find');
  const writeActionsB = writeActionsA.reduce(getWriteAction, {});
  const writeActionsC = Object.values(writeActionsB);
  return writeActionsC;
};

const getWriteAction = function (writeActions, action) {
  const { modelName } = action;
  const { [modelName]: actionsByModel = [] } = writeActions;
  const actionsByModelA = [...actionsByModel, action];
  return { ...writeActions, [action.modelName]: actionsByModelA };
};

module.exports = {
  resolveWriteActions,
};
