'use strict';

const { isEqual, uniq } = require('lodash');

const { assignArray, omit } = require('../../../utilities');
const { ACTIONS, getActionConstant } = require('../../../constants');

const sequenceRead = async function (
  { actions = [], mInput, results = [] },
  nextLayer,
) {
  // Siblings can be run in parallel
  const resultsPromises = actions.map(({ parentAction, childActions }) =>
    singleSequenceRead({
      action: parentAction,
      childActions,
      actions,
      nextLayer,
      mInput,
      results,
    })
  );
  await Promise.all(resultsPromises);

  return { results };
};

const singleSequenceRead = async function ({
  action,
  action: { args, modelName },
  childActions,
  nextLayer,
  mInput,
  results,
}) {
  const {
    isTopLevel,
    actionConstant,
    parentResults,
    commandName,
    nestedParentIds,
    parentIds,
  } = getActionInput({ action, results });

  const argsA = getNestedArg({ args, actionConstant, isTopLevel, parentIds });
  const argsB = normalizeIds({ args: argsA });

  const { concurrentPromises, args: argsC } = getConcurrentCommand({
    args: argsB,
    results,
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
    parentResults,
    commandName,
    nestedParentIds,
  });

  const pendingResults = initCommand({
    args: argsC,
    modelName,
    results,
    promise,
  });

  const finishedResults = await Promise.all([promise, ...concurrentPromises]);

  finishCommand({
    results,
    finishedResults,
    pendingResults,
    action,
    commandName,
    isTopLevel,
    parentResults,
    nestedParentIds,
  });

  // Child actions must start after their parent ends
  await sequenceRead({ actions: childActions, mInput, results }, nextLayer);
};

const getActionInput = function ({
  action: {
    commandPath,
    actionConstant: { type: actionType },
  },
  results,
}) {
  const isTopLevel = commandPath.length === 1;
  const actionConstant = getActionConstant({ actionType, isArray: true });

  const parentPath = commandPath.slice(0, -1);
  const parentResults = results.filter(({ path, promise }) => {
    if (promise !== undefined) { return false; }

    const pathA = path.filter(index => typeof index !== 'number');
    return isEqual(pathA, parentPath);
  });

  const commandName = commandPath[commandPath.length - 1];
  const nestedParentIds = parentResults.map(({ model }) => model[commandName]);
  const parentIds = nestedParentIds
    .reduce(assignArray, [])
    .filter(ids => ids !== undefined);
  const parentIdsA = uniq(parentIds);

  return {
    isTopLevel,
    actionConstant,
    parentResults,
    commandName,
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

const nestedActionTypes = ['find', 'delete', 'patch'];

const normalizeIds = function ({
  args,
  args: { filter: { id, ...filter } = {} },
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
  results,
  modelName,
}) {
  const ids = getIds(args);
  const concurrentResults = getConcurrentResults({
    ids,
    results,
    modelName,
  });

  if (concurrentResults.length === 0) {
    return { args, concurrentPromises: [] };
  }

  const concurrentIds = concurrentResults.map(({ model: { id } }) => id);
  const idsA = ids.filter(id => !concurrentIds.includes(id));
  const argsA = {
    ...args,
    filter: { ...filter, id: idsA },
  };

  const concurrentPromises = concurrentResults
    .map(({ promise, model }) => promise || model);

  return { concurrentPromises, args: argsA };
};

const getIds = function ({ filter: { id: ids } = {} }) {
  return Array.isArray(ids) ? ids : [];
};

const getConcurrentResults = function ({ ids, results, modelName }) {
  return ids
    .map(id => results
      .find(result => result.model.id === id && result.modelName === modelName)
    )
    .filter(result => result !== undefined);
};

const fireReadAction = async function ({
  action: { commandPath, modelName, internal = false },
  mInput,
  nextLayer,
  actionConstant,
  args,
  args: { filter: { id: ids } = {} },
}) {
  // When parent value is not defined, directly returns empty value
  if (Array.isArray(ids) && ids.length === 0) { return []; }

  const argsA = { ...args, internal };
  const argsB = omit(argsA, 'data');
  const { command } = ACTIONS.find(ACTION => actionConstant === ACTION);
  const mInputA = {
    ...mInput,
    action: actionConstant,
    commandPath: commandPath.join('.'),
    modelName,
    args: argsB,
    command,
  };

  const { response: { data: result } } = await nextLayer(mInputA);
  return result;
};

const initCommand = function ({ args, results, modelName, promise }) {
  const ids = getIds(args);
  const pendingResults = ids.map(id => ({
    model: { id },
    modelName,
    promise,
  }));

  // `results` must be shared between parallel command calls,
  // so that each call can reuse the result from other calls when targetting
  // the same model.
  // Hence, `results` must be a mutable variable.
  // eslint-disable-next-line fp/no-mutating-methods
  results.push(...pendingResults);

  return pendingResults;
};

const finishCommand = function ({
  results,
  finishedResults,
  pendingResults,
  action,
  commandName,
  isTopLevel,
  parentResults,
  nestedParentIds,
}) {
  const finishedResultsA = finishedResults.reduce(assignArray, []);

  const finishedResultsB = getResults({
    action,
    commandName,
    isTopLevel,
    parentResults,
    nestedParentIds,
    results: finishedResultsA,
  });

  if (pendingResults.length > 0) {
    const index = results
      .findIndex(result => pendingResults.includes(result));
    // eslint-disable-next-line fp/no-mutating-methods
    results.splice(index, pendingResults.length);
  }

  // eslint-disable-next-line fp/no-mutating-methods
  results.push(...finishedResultsB);
};

const getResults = function ({
  action: { actionConstant: { multiple }, modelName, select },
  commandName,
  isTopLevel,
  parentResults,
  nestedParentIds,
  results,
}) {
  if (isTopLevel) {
    return results.map((model, index) =>
      getResult({ model, index, commandName, multiple, select, modelName })
    );
  }

  return nestedParentIds
    .map((ids, index) => {
      const { path } = parentResults[index];
      return getEachResults({
        ids,
        commandName,
        select,
        path,
        results,
        modelName,
      });
    })
    .reduce(assignArray, []);
};

const getEachResults = function ({
  ids,
  commandName,
  select,
  path,
  results,
  modelName,
}) {
  const multiple = Array.isArray(ids);
  return results
    // Make sure result's sorting is kept
    .filter(({ id }) => (multiple ? ids.includes(id) : ids === id))
    .map((model, ind) => getResult({
      model,
      index: ind,
      path,
      commandName,
      multiple,
      select,
      modelName,
    }));
};

const getResult = function ({
  model,
  index,
  path = [],
  commandName,
  multiple,
  select,
  modelName,
}) {
  const pathA = multiple
    ? [...path, commandName, index]
    : [...path, commandName];
  return { path: pathA, model, modelName, select };
};

module.exports = {
  sequenceRead,
};
