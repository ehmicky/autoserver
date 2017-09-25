'use strict';

const { isEqual, uniq } = require('lodash');

const { assignArray } = require('../../../../../utilities');
const { ACTIONS } = require('../../../../../constants');
const { isTopLevelAction, getActionConstant } = require('../utilities');

const resolveRead = async function ({
  actions = [],
  nextLayer,
  mInput,
  responses = [],
}) {
  // Siblings can be run in parallel
  const responsesPromises = actions.map(({ parentAction, childActions }) =>
    resolveSingleRead({
      action: parentAction,
      childActions,
      actions,
      nextLayer,
      mInput,
      responses,
    })
  );
  await Promise.all(responsesPromises);

  return responses;
};

const resolveSingleRead = async function ({
  action,
  action: { args, modelName },
  childActions,
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

  const argsA = getNestedArg({ args, actionConstant, isTopLevel, parentIds });
  const argsB = normalizeIds({ args: argsA });

  const { concurrentPromises, args: argsC } = getConcurrentCommand({
    args: argsB,
    responses,
    modelName,
  });

  // Parent actions must be run first
  const promise = fireReadAction({
    action,
    mInput,
    nextLayer,
    actionConstant,
    args: argsC,
    isTopLevel,
    parentResponses,
    actionName,
    nestedParentIds,
  });

  const pendingResponses = initCommand({
    args: argsC,
    modelName,
    responses,
    promise,
  });

  const finishedResponses = await Promise.all([promise, ...concurrentPromises]);

  finishCommand({
    responses,
    finishedResponses,
    pendingResponses,
    action,
    actionName,
    isTopLevel,
    parentResponses,
    nestedParentIds,
  });

  // Child actions must start after their parent ends
  await resolveRead({ actions: childActions, nextLayer, mInput, responses });
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
  const parentResponses = responses.filter(({ path, promise }) => {
    if (promise !== undefined) { return false; }

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
  isTopLevel,
  parentIds,
}) {
  const shouldNestArg = !isTopLevel &&
    nestedActionTypes.includes(actionConstant.type);
  if (!shouldNestArg) { return args; }

  const id = parentIds == null ? [] : parentIds;
  return { ...args, filter: { id } };
};

const nestedActionTypes = ['find', 'delete', 'update'];

const normalizeIds = function ({
  args,
  args: { filter: { id } = {}, ...filter },
}) {
  if (typeof id !== 'string') { return args; }

  return {
    ...args,
    filter: { ...filter, id: [id] },
  };
};

const getConcurrentCommand = function ({
  args,
  args: { filter },
  responses,
  modelName,
}) {
  const ids = getIds(args);
  const concurrentResponses = getConcurrentResponses({
    ids,
    responses,
    modelName,
  });

  if (concurrentResponses.length === 0) {
    return { args, concurrentPromises: [] };
  }

  const concurrentIds = concurrentResponses.map(({ model: { id } }) => id);
  const idsA = ids.filter(id => !concurrentIds.includes(id));
  const argsA = {
    ...args,
    filter: { ...filter, id: idsA },
  };

  const concurrentPromises = concurrentResponses
    .map(({ promise, model }) => promise || model);

  return { concurrentPromises, args: argsA };
};

const getIds = function ({ filter: { id: ids } = {} }) {
  return Array.isArray(ids) ? ids : [];
};

const getConcurrentResponses = function ({ ids, responses, modelName }) {
  return ids
    .map(id => responses.find(
      response => response.model.id === id && response.modelName === modelName
    ))
    .filter(response => response !== undefined);
};

const fireReadAction = async function ({
  action: {
    actionPath,
    modelName,
    idCheck = true,
    internal = false,
  },
  mInput,
  nextLayer,
  actionConstant,
  args,
  args: { filter: { id: ids } = {} },
}) {
  // When parent value is not defined, directly returns empty value
  if (Array.isArray(ids) && ids.length === 0) { return []; }

  const argsA = { ...args, idCheck, internal };
  const { command } = ACTIONS.find(ACTION => actionConstant === ACTION);
  const mInputA = {
    ...mInput,
    action: actionConstant,
    actionPath: actionPath.join('.'),
    modelName,
    args: argsA,
    command,
  };

  const { response: { data: response } } = await nextLayer(mInputA);
  return response;
};

const initCommand = function ({ args, responses, modelName, promise }) {
  const ids = getIds(args);
  const pendingResponses = ids.map(id => ({
    model: { id },
    modelName,
    promise,
  }));

  // `responses` must be shared between parallel command calls,
  // so that each call can reuse the response from other calls when targetting
  // the same model.
  // Hence, `responses` must be a mutable variable.
  // eslint-disable-next-line fp/no-mutating-methods
  responses.push(...pendingResponses);

  return pendingResponses;
};

const finishCommand = function ({
  responses,
  finishedResponses,
  pendingResponses,
  action,
  actionName,
  isTopLevel,
  parentResponses,
  nestedParentIds,
}) {
  const finishedResponsesA = finishedResponses.reduce(assignArray, []);

  const finishedResponsesB = getResponses({
    action,
    actionName,
    isTopLevel,
    parentResponses,
    nestedParentIds,
    responses: finishedResponsesA,
  });

  if (pendingResponses.length > 0) {
    const index = responses
      .findIndex(response => pendingResponses.includes(response));
    // eslint-disable-next-line fp/no-mutating-methods
    responses.splice(index, pendingResponses.length);
  }

  // eslint-disable-next-line fp/no-mutating-methods
  responses.push(...finishedResponsesB);
};

const getResponses = function ({
  action: { actionConstant: { multiple }, modelName, select },
  actionName,
  isTopLevel,
  parentResponses,
  nestedParentIds,
  responses,
}) {
  if (isTopLevel) {
    return responses.map((model, index) =>
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
        responses,
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
  responses,
  modelName,
}) {
  const multiple = Array.isArray(ids);
  return responses
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
