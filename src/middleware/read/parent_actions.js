'use strict';

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
  const childActionsA = getParentActions({
    actions: childActions,
    top,
    modelsMap,
  });
  return { parentAction, childActions: childActionsA };
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

module.exports = {
  getParentActions,
};
