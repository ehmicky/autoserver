'use strict';

const { mergeArrayReducer } = require('../../utilities');
const { getCommand } = require('../../constants');

// Fire all write actions, retrieving some `results`
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

// All write actions are normalized to be multiple
const multiplyAction = function ({ command: { type: commandType }, ...rest }) {
  const command = getCommand({ commandType, multiple: true });
  return { ...rest, command };
};

// Group actions by model
const getWriteActions = function ({ actions }) {
  const actionsA = actions.filter(({ command }) => command.type !== 'find');
  const actionsB = actionsA.reduce(mergeArrayReducer('modelName'), {});
  const actionsC = Object.values(actionsB);
  return actionsC;
};

module.exports = {
  resolveWriteActions,
};
