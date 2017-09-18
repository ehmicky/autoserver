'use strict';

const { isEqual, uniq } = require('lodash');

const { reduceAsync, assignArray, omit } = require('../../../../../utilities');
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
    select,
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
    nestedParentIds,
    parentIds,
  } = getActionInput({ action, results });

  const argsA = getNestedArg({ args, actionConstant, parentIds, isTopLevel });

  const response = await fireReadAction({
    mInput,
    nextLayer,
    actionConstant,
    actionPath,
    modelName,
    args: argsA,
  });

  const responses = getResponses({
    actionName,
    multiple,
    isTopLevel,
    parentAction,
    nestedParentIds,
    response,
    select,
  });
  const result = { ...action, responses };
  const resultA = omit(result, 'select');

  return [...results, resultA];
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
  const { responses: parentResponses = [] } = parentAction;
  const nestedParentIds = parentResponses.map(({ model }) => model[actionName]);
  const parentIds = nestedParentIds.reduce(assignArray, []);
  const parentIdsA = uniq(parentIds);

  return {
    isTopLevel,
    actionConstant,
    parentAction,
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

  return { ...args, filter: { id: parentIds } };
};

const nestedActionTypes = ['find', 'delete', 'update'];

const fireReadAction = async function ({
  mInput,
  nextLayer,
  actionConstant,
  actionPath,
  modelName,
  args,
  args: { filter: { id } },
}) {
  // When parent value is not defined, directly returns empty value
  if (Array.isArray(id) && id.length === 0) { return []; }

  const mInputA = {
    ...mInput,
    action: actionConstant,
    actionPath,
    modelName,
    args,
  };

  const { response: { data: response } } = await nextLayer(mInputA);

  return response;
};

const getResponses = function ({
  actionName,
  multiple,
  isTopLevel,
  parentAction: { responses: parentResponses },
  nestedParentIds,
  response,
  select,
}) {
  if (isTopLevel) {
    return response.map((model, index) =>
      getResponse({ model, index, actionName, multiple, select })
    );
  }

  return nestedParentIds
    .map((ids, index) => {
      const { path } = parentResponses[index];
      return getEachResponses({
        ids,
        actionName,
        multiple,
        select,
        path,
        response,
      });
    })
    .reduce(assignArray, []);
};

const getEachResponses = function ({
  ids,
  actionName,
  multiple,
  select,
  path,
  response,
}) {
  return response
    // Make sure response's sorting is kept
    .filter(({ id }) => (Array.isArray(ids) ? ids.includes(id) : ids === id))
    .map((model, ind) =>
      getResponse({ model, index: ind, path, actionName, multiple, select })
    );
};

const getResponse = function ({
  model,
  index,
  path = [],
  actionName,
  multiple,
  select,
}) {
  const pathA = multiple
    ? [...path, actionName, index]
    : [...path, actionName];
  return { path: pathA, model, select };
};

module.exports = {
  resolveRead,
};
