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
    actionConstant: { type: actionType, multiple },
    modelName,
    args,
  },
  nextLayer,
  mInput,
  results,
}) {
  const actionConstant = getActionConstant({ actionType, isArray: true });

  const parentPath = actionPath.slice(0, -1);
  const parentAction = results
    .find(({ actionPath: path }) => isEqual(path, parentPath)) || {};

  const actionName = actionPath[actionPath.length - 1];
  const parent = parentAction.response || [];
  const nonFlatParent = parent.map(model => model[actionName]);
  const flatParent = nonFlatParent.reduce(assignArray, []);
  const isTopLevel = isTopLevelAction({ actionPath });

  // When parent value is not defined, returns empty value
  const isEmptyAction = !isTopLevel && flatParent.length === 0;
  if (isEmptyAction) { return []; }

  const argsA = getNestedArg({ args, actionConstant, flatParent, isTopLevel });

  const mInputA = {
    ...mInput,
    action: actionConstant,
    actionPath,
    modelName,
    args: argsA,
  };
  const { response: { data: response } } = await nextLayer(mInputA);

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
