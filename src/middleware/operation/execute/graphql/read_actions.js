'use strict';

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
  return actions.filter(({ actionConstant }) => actionConstant.type === 'find');
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
