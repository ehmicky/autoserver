'use strict';

const { isEqual, uniq } = require('lodash');

const { assignArray } = require('../../../../../utilities');
const { ACTIONS } = require('../../../../../constants');
const { isTopLevelAction, getActionConstant } = require('../utilities');

const resolveRead = async function ({
  actions,
  nextLayer,
  mInput,
  responses,
}) {
  // Siblings can be run in parallel
  const responsesPromises = actions
    .map(({ parentAction, childActions }) => resolveSingleRead({
      action: parentAction,
      childActions,
      actions,
      nextLayer,
      mInput,
      responses,
    }));
  const responsesA = await Promise.all(responsesPromises);
  const responsesB = responsesA.reduce(assignArray, []);

  const responsesC = responses || [];
  return [...responsesC, ...responsesB];
};

const resolveSingleRead = async function ({
  action,
  action: {
    actionPath,
    actionConstant: { multiple },
    modelName,
    args,
    select,
    idCheck = true,
    internal = false,
  },
  childActions = [],
  nextLayer,
  mInput,
  responses,
}) {
  const {
    isTopLevel,
    actionConstant,
    parentResponses,
    actionName,
    nestedParentIds,
    parentIds,
  } = getActionInput({ action, responses });

  const argsA = getNestedArg({ args, actionConstant, parentIds, isTopLevel });
  const argsB = { ...argsA, idCheck, internal };

  // Parent actions must be run first
  const response = await fireReadAction({
    mInput,
    nextLayer,
    actionConstant,
    actionPath,
    modelName,
    args: argsB,
  });

  const responsesA = getResponses({
    actionName,
    multiple,
    isTopLevel,
    parentResponses,
    nestedParentIds,
    response,
    select,
    modelName,
  });

  // Child actions must start after their parent ends
  const childResponses = await resolveRead({
    actions: childActions,
    nextLayer,
    mInput,
    responses: responsesA,
  });

  return childResponses;
};

const getActionInput = function ({
  action: {
    actionPath,
    actionConstant: { type: actionType },
  },
  responses,
}) {
  const isTopLevel = isTopLevelAction({ actionPath }) ||
    // When firing read actions in parallel
    responses === undefined;
  const actionConstant = getActionConstant({ actionType, isArray: true });

  const parentPath = actionPath.slice(0, -1);
  const responsesA = responses || [];
  const parentResponses = responsesA.filter(({ path }) => {
    const pathA = path.filter(index => typeof index !== 'number');
    return isEqual(pathA, parentPath);
  });

  const actionName = actionPath[actionPath.length - 1];
  const nestedParentIds = parentResponses.map(({ model }) => model[actionName]);
  const parentIds = nestedParentIds
    .reduce(assignArray, [])
    .filter(ids => ids !== undefined);
  const parentIdsA = uniq(parentIds);

  return {
    isTopLevel,
    actionConstant,
    parentResponses,
    actionName,
    nestedParentIds,
    parentIds: parentIdsA,
  };
};

// Make nested models filtered by their parent model
// E.g. if a model findParent() returns { child: 1 },
// then a nested query findChild() will be filtered by `id: 1`
// If the parent returns nothing|null, the nested query won't be performed
// and null will be returned
const getNestedArg = function ({
  args,
  actionConstant,
  parentIds,
  isTopLevel,
}) {
  const shouldNestArg = !isTopLevel &&
    nestedActionTypes.includes(actionConstant.type);
  if (!shouldNestArg) { return args; }

  const id = parentIds == null ? [] : parentIds;
  return { ...args, filter: { id } };
};

const nestedActionTypes = ['find', 'delete', 'update'];

const fireReadAction = async function ({
  mInput,
  nextLayer,
  actionConstant,
  actionPath,
  modelName,
  args,
  args: { filter: { id } = {} },
}) {
  const { command } = ACTIONS.find(action => actionConstant === action);

  // When parent value is not defined, directly returns empty value
  if (Array.isArray(id) && id.length === 0) { return []; }

  const mInputA = {
    ...mInput,
    action: actionConstant,
    actionPath: actionPath.join('.'),
    modelName,
    args,
    command,
  };

  const { response: { data: response } } = await nextLayer(mInputA);

  return response;
};

const getResponses = function ({
  actionName,
  multiple,
  isTopLevel,
  parentResponses,
  nestedParentIds,
  response,
  select,
  modelName,
}) {
  if (isTopLevel) {
    return response.map((model, index) =>
      getResponse({ model, index, actionName, multiple, select, modelName })
    );
  }

  return nestedParentIds
    .map((ids, index) => {
      const { path } = parentResponses[index];
      return getEachResponses({
        ids,
        actionName,
        select,
        path,
        response,
        modelName,
      });
    })
    .reduce(assignArray, []);
};

const getEachResponses = function ({
  ids,
  actionName,
  select,
  path,
  response,
  modelName,
}) {
  const multiple = Array.isArray(ids);
  return response
    // Make sure response's sorting is kept
    .filter(({ id }) => (multiple ? ids.includes(id) : ids === id))
    .map((model, ind) => getResponse({
      model,
      index: ind,
      path,
      actionName,
      multiple,
      select,
      modelName,
    }));
};

const getResponse = function ({
  model,
  index,
  path = [],
  actionName,
  multiple,
  select,
  modelName,
}) {
  const pathA = multiple
    ? [...path, actionName, index]
    : [...path, actionName];
  return { path: pathA, model, modelName, select };
};

module.exports = {
  resolveRead,
};
