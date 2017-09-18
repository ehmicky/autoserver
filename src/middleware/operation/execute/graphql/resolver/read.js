'use strict';

const { isEqual } = require('lodash');

const { reduceAsync, assignArray } = require('../../../../../utilities');
const { isTopLevelAction, getActionConstant } = require('../utilities');

const resolveRead = function ({ actions, nextLayer, mInput }) {
  return reduceAsync(
    actions,
    (results, action) =>
      resolveReadAction({ action, nextLayer, mInput, results }),
    [],
  );
};

const resolveReadAction = async function ({
  action,
  action: {
    actionPath,
    actionConstant: { multiple },
    modelName,
    args,
  },
  nextLayer,
  mInput,
  results,
}) {
  const {
    isTopLevel,
    actionConstant,
    parentAction,
    actionName,
    nonFlatParent,
    flatParent,
  } = getActionInput({ action, results });

  const argsA = getNestedArg({ args, actionConstant, flatParent, isTopLevel });

  const { response: { data: response } } = await fireReadAction({
    mInput,
    nextLayer,
    actionConstant,
    actionPath,
    modelName,
    args: argsA,
  });

  const result = addRespPaths({
    action,
    actionName,
    multiple,
    isTopLevel,
    parentAction,
    nonFlatParent,
    response,
  });
  return [...results, result];
};

const getActionInput = function ({
  action: {
    actionPath,
    actionConstant: { type: actionType },
  },
  results,
}) {
  const isTopLevel = isTopLevelAction({ actionPath });
  const actionConstant = getActionConstant({ actionType, isArray: true });

  const parentPath = actionPath.slice(0, -1);
  const parentAction = results
    .find(({ actionPath: path }) => isEqual(path, parentPath)) || {};

  const actionName = actionPath[actionPath.length - 1];
  const parent = parentAction.response || [];
  const nonFlatParent = parent.map(model => model[actionName]);
  const flatParent = nonFlatParent.reduce(assignArray, []);

  return {
    isTopLevel,
    actionConstant,
    parentAction,
    actionName,
    nonFlatParent,
    flatParent,
  };
};

const fireReadAction = function ({
  mInput,
  nextLayer,
  actionConstant,
  actionPath,
  modelName,
  args,
  args: { filter: { id } },
}) {
  // When parent value is not defined, directly returns empty value
  if (Array.isArray(id) && id.length === 0) {
    return [];
  }

  const mInputA = {
    ...mInput,
    action: actionConstant,
    actionPath,
    modelName,
    args,
  };

  return nextLayer(mInputA);
};

// Make nested models filtered by their parent model
// E.g. if a model findParent() returns { child: 1 },
// then a nested query findChild() will be filtered by `id: 1`
// If the parent returns nothing|null, the nested query won't be performed
// and null will be returned
const getNestedArg = function ({
  args,
  actionConstant,
  flatParent,
  isTopLevel,
}) {
  const shouldNestArg = !isTopLevel &&
    nestedActionTypes.includes(actionConstant.type);
  if (!shouldNestArg) { return args; }

  return { ...args, filter: { id: flatParent } };
};

const nestedActionTypes = ['find', 'delete', 'update'];

const addRespPaths = function ({
  action,
  actionName,
  multiple,
  isTopLevel,
  parentAction,
  nonFlatParent,
  response,
}) {
  const respPaths = getRespPaths({
    actionName,
    multiple,
    isTopLevel,
    parentAction,
    nonFlatParent,
    response,
  });
  return { ...action, respPaths, response };
};

const getRespPaths = function ({
  actionName,
  multiple,
  isTopLevel,
  parentAction: { respPaths: parentRespPaths },
  nonFlatParent,
  response,
}) {
  if (isTopLevel) {
    return response.map(({ id }, index) =>
      getRespPath({ id, index, actionName, multiple })
    );
  }

  return nonFlatParent
    .map((ids, index) => {
      const { path } = parentRespPaths[index];
      return getEachRespPaths({ ids, actionName, multiple, path, response });
    })
    .reduce(assignArray, []);
};

const getEachRespPaths = function ({
  ids,
  actionName,
  multiple,
  path,
  response,
}) {
  const idsA = Array.isArray(ids) ? ids : [ids];

  return response
    // Make sure response's sorting is kept
    .filter(({ id }) => idsA.includes(id))
    .map(({ id }, ind) =>
      getRespPath({ id, index: ind, path, actionName, multiple })
    );
};

const getRespPath = function ({ id, index, path = [], actionName, multiple }) {
  const pathA = multiple
    ? [...path, actionName, index]
    : [...path, actionName];
  return { path: pathA, id };
};

module.exports = {
  resolveRead,
};
