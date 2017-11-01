'use strict';

const { assignArray, isEqual } = require('../../../utilities');
const { getModel } = require('../get_model');
const { isParentAction, getChildActions } = require('../child_actions');

// Create a structure indicating which actions are the parents of which action.
// This is needed since parent actions must be fired before children.
// Uses `commandPath` to determine this, and output a recursive structure
// { parentAction, childActions: [{...}, ...] }
const getParentActions = function ({ actions, top, modelsMap }) {
  return actions
    .filter(action => isParentAction({ action, actions }))
    .map(parentAction => getParentAction({
      parentAction,
      actions,
      top,
      modelsMap,
    }));
};

const getParentAction = function ({ parentAction, actions, top, modelsMap }) {
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
};

// When trying to find ancestors actions without trying to find their parent,
// this creates the intermediate actions so that their parent is queried.
// This can happen e.g. with delete commands `args.cascade`.
// E.g. cascade="child.grand_child" needs to query "child" before querying
// "child.grand_child" (so that it accesses parent value) during currentData
// query, but only "child.grand_child" must be deleted.
const createMidChildren = function ({ childActions, ...rest }) {
  return childActions
    .map(childAction => createMidChild({ childAction, childActions, ...rest }))
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
  getParentActions,
};
