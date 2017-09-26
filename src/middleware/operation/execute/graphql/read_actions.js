'use strict';

const { getTopLevelAction, getActionConstant } = require('./utilities');

const resolveReadActions = function ({
  actions,
  nextLayer,
  otherLayer,
  mInput,
  responses,
}) {
  const actionsA = getReadActions({ actions });

  const actionsB = getParentActions({ actions: actionsA });

  return otherLayer({
    actionsGroupType: 'read',
    actions: actionsB,
    nextLayer,
    mInput,
    responses,
  });
};

const getReadActions = function ({ actions }) {
  const topLevelAction = getTopLevelRead({ actions });
  const actionsA = actions
    .filter(({ actionConstant }) => actionConstant.type === 'find');
  return [...topLevelAction, ...actionsA];
};

const getTopLevelRead = function ({ actions }) {
  const topLevelAction = getTopLevelAction({ actions });
  const {
    actionConstant: { type: actionType, multiple },
    currentData,
    args,
  } = topLevelAction;

  if (actionType === 'find') { return []; }

  const actionConstant = getActionConstant({
    actionType: 'find',
    isArray: multiple,
  });
  const data = args.data || currentData;
  const ids = data.map(({ id }) => id);
  const argsA = { ...args, filter: { id: ids } };

  return [{
    ...topLevelAction,
    actionConstant,
    args: argsA,
  }];
};

const getParentActions = function ({ actions }) {
  return actions
    .filter(action => isParentAction({ action, actions }))
    .map(parentAction => {
      const childActions = getChildActions({ parentAction, actions });
      const childActionsA = getParentActions({ actions: childActions });
      return { parentAction, childActions: childActionsA };
    });
};

const isParentAction = function ({ action: childAction, actions }) {
  return !actions
    .some(parentAction => isChildAction({ childAction, parentAction }));
};

const getChildActions = function ({ parentAction, actions }) {
  return actions
    .filter(childAction => isChildAction({ childAction, parentAction }));
};

const isChildAction = function ({
  parentAction,
  parentAction: { actionPath: parentPath },
  childAction,
  childAction: { actionPath: childPath },
}) {
  return childAction !== parentAction &&
    childPath.length > parentPath.length &&
    childPath.join('.').startsWith(parentPath.join('.'));
};

module.exports = {
  resolveReadActions,
};
