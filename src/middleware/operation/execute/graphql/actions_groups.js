'use strict';

const { assignArray } = require('../../../../utilities');

const addActionsGroups = function ({ actions: allActions }) {
  return allActions.reduce(
    (actions, action, index) =>
      addActionsGroup({ allActions, actions, action, index }),
    [],
  );
};

const addActionsGroup = function ({ allActions, actions, action, index }) {
  const alreadyHandled = isAlreadyHandled({ actions, action });
  if (alreadyHandled) { return actions; }

  const actionsA = getGroupActions({ allActions, action, index });
  return [...actions, actionsA];
};

const isAlreadyHandled = function ({ actions, action }) {
  return actions
    .reduce(assignArray, [])
    .some(actionA => actionA === action);
};

const getGroupActions = function ({ allActions, action: actionA, index }) {
  const nextActions = allActions.slice(index);
  return nextActions.filter(actionB => isActionInGroup({ actionA, actionB }));
};

const isActionInGroup = function ({ actionA, actionB }) {
  if (actionB.actionConstant.type === 'read') { return false; }

  return actionB.actionConstant === actionA.actionConstant &&
    actionB.modelName === actionA.modelName;
};

module.exports = {
  addActionsGroups,
};
