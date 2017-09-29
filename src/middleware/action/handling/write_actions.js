'use strict';

const { mergeArrayReducer } = require('../../../utilities');

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
  const actionsB = actionsA.reduce(mergeArrayReducer('modelName'), {});
  const actionsC = Object.values(actionsB);
  return actionsC;
};

module.exports = {
  resolveWriteActions,
};
