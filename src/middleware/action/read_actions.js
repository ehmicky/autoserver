'use strict';

const { isEqual } = require('lodash');

const { assignArray } = require('../../utilities');
const { getActionConstant } = require('../../constants');

const { getModel } = require('./get_model');

const resolveReadActions = function (
  { actions, top, idl: { shortcuts: { modelsMap } }, mInput, results },
  nextLayer,
) {
  const actionsA = getReadActions({ actions, top });

  const actionsB = getParentActions({ actions: actionsA, top, modelsMap });

  return nextLayer({
    ...mInput,
    actionsGroupType: 'read',
    actions: actionsB,
    results,
  });
};

const getReadActions = function ({ actions, top }) {
  return actions
    .map(action => getReadAction({ action, top }))
    .reduce(assignArray, []);
};

const getReadAction = function ({
  action,
  action: { commandPath, actionConstant: { type: actionType, multiple } },
  top,
}) {
  const isTopLevel = isEqual(top.commandPath, commandPath);

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

// `currentData` query will reuse the ids from replace|create `data`,
// and the `filter` from find|delete|patch.
// Selection query will reuse `currentData` from replace|delete|patch,
// `data` from create, and `filter` from find.
const getTopLevelFilter = function ({ action, action: { args: { filter } } }) {
  const models = getModels({ action });

  if (models === undefined) { return filter; }

  const ids = models.map(({ id }) => id);
  return { id: ids };
};

const getModels = function ({ action: { currentData, args: { data } } }) {
  if (currentData) { return currentData; }

  // Use replace|create `data`, but not patch `data`
  const hasDataIds = data && data.every(datum => datum.id !== undefined);
  if (hasDataIds) { return data; }
};

const getParentActions = function ({ actions, top, modelsMap }) {
  return actions
    .filter(action => isParentAction({ action, actions }))
    .map(parentAction => {
      const childActions = getChildActions({ parentAction, actions });
      const childActionsA = createMidChildren({
        parentAction,
        childActions,
        top,
        modelsMap,
      });
      const childActionsB = getParentActions({
        actions: childActionsA,
        top,
        modelsMap,
      });
      return { parentAction, childActions: childActionsB };
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
  parentAction: { commandPath: parentPath },
  childAction,
  childAction: { commandPath: childPath },
}) {
  return childAction !== parentAction &&
    childPath.length > parentPath.length &&
    childPath.join('.').startsWith(parentPath.join('.'));
};

// When trying to find ancestors actions without trying to find their parent,
// this creates the intermediate actions so that their parent is queried.
// This can happen e.g. with delete actions's `args.cascade`
// E.g. cascade="child.grand_child" needs to query "child" before querying
// "child.grand_child" (so that it accesses parent value) during currentData
// query, but only "child.grand_child" must be deleted.
const createMidChildren = function ({
  parentAction,
  childActions,
  top,
  modelsMap,
}) {
  return childActions
    .map(childAction => createMidChild({
      parentAction,
      childAction,
      childActions,
      top,
      modelsMap,
    }))
    .reduce(assignArray, []);
};

const createMidChild = function ({
  parentAction: { commandPath: parentPath },
  childAction,
  childAction: { commandPath: childPath },
  childActions,
  top,
  modelsMap,
}) {
  const commandPath = childPath.slice(0, parentPath.length + 1);
  const isDirectChild = childPath.length === parentPath.length + 1;
  // Means the intermediate actions is missing
  const alreadyPresent = childActions
    .some(action => isEqual(action.commandPath, commandPath));

  if (isDirectChild || alreadyPresent) {
    return [childAction];
  }

  // Create intermediate action
  const { modelName } = getModel({ modelsMap, top, commandPath });
  const midChild = { ...childAction, commandPath, modelName };
  return [midChild, childAction];
};

module.exports = {
  resolveReadActions,
};
