'use strict';

const { mergeArrayReducer } = require('../../../utilities');
const { getActionConstant } = require('../../../constants');

const resolveWriteActions = function (
  { actions, top, mInput },
  nextLayer,
) {
  const actionsA = actions.map(multiplyAction);
  const actionsGroups = getWriteActions({ actions: actionsA });

  return nextLayer({
    ...mInput,
    actionsGroupType: 'write',
    actionsGroups,
    top,
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
