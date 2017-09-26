'use strict';

const { isEqual } = require('lodash');

const { getActionConstant } = require('./utilities');

const resolveReadActions = function ({
  actions,
  top,
  nextLayer,
  otherLayer,
  mInput,
  responses,
}) {
  const actionsA = getReadActions({ actions, top });

  const actionsB = getParentActions({ actions: actionsA });

  return otherLayer({
    actionsGroupType: 'read',
    actions: actionsB,
    nextLayer,
    mInput,
    responses,
  });
};

const getReadActions = function ({ actions, top }) {
  const topLevelAction = getTopLevelRead({ actions, top });
  const actionsA = actions
    .filter(({ actionConstant }) => actionConstant.type === 'find');
  return [...topLevelAction, ...actionsA];
};

const getTopLevelRead = function ({
  actions,
  top,
  top: { actionConstant: { type: actionType, multiple } },
}) {
  if (actionType === 'find') { return []; }

  const actionConstant = getActionConstant({
    actionType: 'find',
    isArray: multiple,
  });

  const action = actions
    .find(({ actionPath }) => isEqual(actionPath, top.actionPath));
  const filter = getTopLevelFilter({ action });

  return [{
    ...action,
    actionConstant,
    args: { ...action.args, filter },
  }];
};

const getTopLevelFilter = function ({
  action: { currentData, args: { data, filter } },
}) {
  if (filter !== undefined) { return filter; }

  const models = data || currentData;
  const ids = models.map(({ id }) => id);
  return { id: ids };
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
