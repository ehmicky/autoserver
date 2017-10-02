'use strict';

const { mergeArrayReducer } = require('../../utilities');
const { getCommand } = require('../../constants');

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

const multiplyAction = function ({ command: { type: commandType }, ...rest }) {
  const command = getCommand({ commandType, multiple: true });
  return { ...rest, command };
};

const getWriteActions = function ({ actions }) {
  const actionsA = actions.filter(({ command }) => command.type !== 'find');
  const actionsB = actionsA.reduce(mergeArrayReducer('modelName'), {});
  const actionsC = Object.values(actionsB);
  return actionsC;
};

module.exports = {
  resolveWriteActions,
};
