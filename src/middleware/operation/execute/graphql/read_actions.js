'use strict';

const { isEqual } = require('lodash');

const { assignArray } = require('../../../../utilities');

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
  return actions
    .map(action => getReadAction({ action, top }))
    .reduce(assignArray, []);
};

const getReadAction = function ({
  action,
  action: { actionPath, actionConstant: { type: actionType, multiple } },
  top,
}) {
  const isTopLevel = isEqual(top.actionPath, actionPath);

  if (!isTopLevel) {
    return actionType === 'find' ? [action] : [];
  }

  const actionConstant = getActionConstant({
    actionType: 'find',
    isArray: multiple,
  });

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
