'use strict';

const { assignArray } = require('../../../../utilities');

const { getActionConstant } = require('./utilities');

const resolveWriteActions = async function ({
  actions: allActions,
  nextLayer,
  otherLayer,
  mInput,
}) {
  const writeActions = allActions.map(multiplyAction);
  const writeActionsA = getWriteActions({ writeActions });
  const responsesPromises = writeActionsA.map(actions => otherLayer({
    actionsGroupType: 'write',
    actions,
    nextLayer,
    mInput,
  }));
  const responses = await Promise.all(responsesPromises);
  const responsesA = responses.reduce(assignArray, []);
  return responsesA;
};

const multiplyAction = function ({
  actionConstant: { type: actionType },
  ...rest
}) {
  const actionConstant = getActionConstant({ actionType, isArray: true });
  return { ...rest, actionConstant };
};

const getWriteActions = function ({ writeActions }) {
  const writeActionsA = writeActions
    .filter(({ actionConstant }) => actionConstant.type !== 'find');
  const writeActionsB = writeActionsA.reduce(reduceWriteAction, {});
  const writeActionsC = Object.values(writeActionsB);
  return writeActionsC;
};

const reduceWriteAction = function (writeActions, action) {
  const { modelName } = action;
  const { [modelName]: actionsByModel = [] } = writeActions;
  const actionsByModelA = [...actionsByModel, action];
  return { ...writeActions, [action.modelName]: actionsByModelA };
};

module.exports = {
  resolveWriteActions,
};
