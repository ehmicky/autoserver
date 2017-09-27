'use strict';

const { getActionConstant } = require('./utilities');

const resolveWriteActions = function ({
  actions,
  top,
  nextLayer,
  otherLayer,
  mInput,
}) {
  const actionsA = actions.map(multiplyAction);
  const actionsGroups = getWriteActions({ actions: actionsA });

  return otherLayer({
    actionsGroupType: 'write',
    actionsGroups,
    top,
    nextLayer,
    mInput,
  });
};

const multiplyAction = function ({
  actionConstant: { type: actionType },
  ...rest
}) {
  const actionConstant = getActionConstant({ actionType, isArray: true });
  return { ...rest, actionConstant };
};

const getWriteActions = function ({ actions }) {
  const actionsA = actions
    .filter(({ actionConstant }) => actionConstant.type !== 'find');
  const actionsB = actionsA.reduce(reduceWriteAction, {});
  const actionsC = Object.values(actionsB);
  return actionsC;
};

const reduceWriteAction = function (actions, action) {
  const { modelName } = action;
  const { [modelName]: actionsByModel = [] } = actions;
  const actionsByModelA = [...actionsByModel, action];
  return { ...actions, [action.modelName]: actionsByModelA };
};

module.exports = {
  resolveWriteActions,
};
