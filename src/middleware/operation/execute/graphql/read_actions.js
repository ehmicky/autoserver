'use strict';

const { assignArray } = require('../../../../utilities');

const resolveReadActions = async function ({
  actions,
  nextLayer,
  otherLayer,
  mInput,
  responses,
}) {
  if (actions.length === 0) { return responses; }

  const actionsA = getReadActions({ actions });

  const parentActions = getParentActions({ actions: actionsA });

  // Siblings can be run in parallel
  const responsesPromises = parentActions.map(parentAction => fireReadActions({
    parentAction,
    actions,
    nextLayer,
    otherLayer,
    mInput,
    responses,
  }));
  const responsesA = await Promise.all(responsesPromises);
  const responsesB = responsesA.reduce(assignArray, []);

  return [...responses, ...responsesB];
};

const getReadActions = function ({ actions }) {
  return actions.filter(({ actionConstant }) => actionConstant.type === 'find');
};

const fireReadActions = async function ({
  parentAction,
  actions,
  nextLayer,
  otherLayer,
  mInput,
  responses,
}) {
  // Parent actions must be run first
  const responsesA = await otherLayer({
    actionsGroupType: 'read',
    actions: [parentAction],
    nextLayer,
    mInput,
    responses,
  });

  // Child actions must start after their parent ends
  const childActions = getChildActions({ parentAction, actions });
  const childResponses = resolveReadActions({
    actions: childActions,
    nextLayer,
    otherLayer,
    mInput,
    responses: responsesA,
  });

  return childResponses;
};

const getParentActions = function ({ actions }) {
  return actions.filter(action => isParentAction({ action, actions }));
};

const isParentAction = function ({ action: childAction, actions }) {
  return !actions
    .some(parentAction => isChildAction({ childAction, parentAction }));
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

const getChildActions = function ({ parentAction, actions }) {
  return actions
    .filter(childAction => isChildAction({ childAction, parentAction }));
};

module.exports = {
  resolveReadActions,
};
