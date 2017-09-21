'use strict';

const { isEqual, uniq } = require('lodash');

const { assignArray } = require('../../../../../utilities');
const { isTopLevelAction, getActionConstant } = require('../utilities');

const resolveRead = async function ({
  actions: [action],
  actions: [{
    actionPath,
    actionConstant: { multiple },
    modelName,
    args,
    select,
  }],
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

  const response = await fireReadAction({
    mInput,
    nextLayer,
    actionConstant,
    actionPath,
    modelName,
    args: argsA,
  });

  const responsesA = getResponses({
    actionName,
    multiple,
    isTopLevel,
    parentResponses,
    nestedParentIds,
    response,
    select,
  });

  return responsesA;
};

const getActionInput = function ({
  action: {
    actionPath,
    actionConstant: { type: actionType },
  },
  responses,
}) {
  const isTopLevel = isTopLevelAction({ actionPath });
  const actionConstant = getActionConstant({ actionType, isArray: true });

  const parentPath = actionPath.slice(0, -1);
  const parentResponses = responses.filter(({ path }) => {
    const pathA = path.filter(index => typeof index !== 'number');
    return isEqual(pathA, parentPath);
  });

  const actionName = actionPath[actionPath.length - 1];
  const nestedParentIds = parentResponses.map(({ model }) => model[actionName]);
  const parentIds = nestedParentIds.reduce(assignArray, []);
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
  args: { filter: { id } = {} },
}) {
  // When parent value is not defined, directly returns empty value
  if (Array.isArray(id) && id.length === 0) { return []; }

  const mInputA = {
    ...mInput,
    action: actionConstant,
    actionPath: actionPath.join('.'),
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
  parentResponses,
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
