'use strict';

const { isEqual } = require('lodash');

const { reduceAsync, assignArray } = require('../../../../utilities');

const { isTopLevelAction } = require('./utilities');

const fireDataResolvers = function ({ actions, nextLayer, mInput }) {
  const actionsPromises = actions
    .map(action => fireDataAction({ action, nextLayer, mInput }));
  return Promise.all(actionsPromises);
};

const fireDataAction = async function ({
  action,
  action: { actionConstant, actionPath, modelName, args },
  nextLayer,
  mInput,
}) {
  const mInputA = {
    ...mInput,
    action: actionConstant,
    actionPath,
    modelName,
    args,
  };
  const { response: { data: response } } = await nextLayer(mInputA);

  return { ...action, response };
};

const fireResolvers = function ({ actions, nextLayer, mInput }) {
  return reduceAsync(
    actions,
    (resultsA, action) =>
      fireAction({ action, nextLayer, mInput, results: resultsA }),
    [],
  );
};

const fireAction = async function ({ action, nextLayer, mInput, results }) {
  const { actionPath } = action;

  const parentPath = actionPath.slice(0, -1);
  const { data: parent } = results
    .find(({ actionPath: path }) => isEqual(path, parentPath)) || {};
  const data = await resolver({ parent, nextLayer, mInput, ...action });
  const result = getResult({ data, ...action });
  const resultsA = [...results, ...result];

  const actionsB = getActions({ actions: actionsA, data, actionPath });
  if (actionsB.length === 0) { return resultsA; }

  return fireResolvers({
    actions: actionsB,
    nextLayer,
    mInput,
    results: resultsA,
  });
};

const resolver = async function ({
  parent = {},
  nextLayer,
  mInput,
  modelName,
  actionConstant: action,
  actionConstant: { multiple },
  actionPath,
  args,
}) {
  const mInputA = { ...mInput, action, actionPath, modelName, args };
  const mInputB = await nextLayer(mInputA);

  return mInputB.response.data;
};

  /*
  const actionName = actionPath[actionPath.length - 1];
  const parentVal = parent[actionName];
  const isTopLevel = isTopLevelAction({ actionPath });

  if (isEmptyAction({ parentVal, isTopLevel })) {
    return multiple ? [] : null;
  }

  const argsA = getNestedArg({ args, action, parentVal, isTopLevel });
  */

// When parent value is not defined, returns empty value
const isEmptyAction = function ({ parentVal, isTopLevel }) {
  return !isTopLevel &&
    (
      (Array.isArray(parentVal) && parentVal.length === 0) ||
      parentVal == null
    );
};

// Make nested models filtered by their parent model
// E.g. if a model findParent() returns { child: 1 },
// then a nested query findChild() will be filtered by `id: 1`
// If the parent returns nothing|null, the nested query won't be performed
// and null will be returned
const getNestedArg = function ({ args, action, parentVal, isTopLevel }) {
  const shouldNestArg = !isTopLevel &&
    nestedActionTypes.includes(action.type);
  if (!shouldNestArg) { return args; }

  return { ...args, filter: { id: parentVal } };
};

const nestedActionTypes = ['find', 'delete', 'update'];

const getResult = function ({ data, actionPath, ...rest }) {
  if (!Array.isArray(data)) {
    return [{ data, actionPath, ...rest }];
  }

  return data.map((datum, index) => ({
    data: datum,
    actionPath: [...actionPath, index],
    ...rest,
  }));
};

const getActions = function ({ actions, data, actionPath }) {
  if (!Array.isArray(data)) { return actions; }

  return actions
    .map(action => getAction({ action, data, actionPath }))
    .reduce(assignArray, []);
};

const getAction = function ({
  action,
  action: { actionPath: childActionPath },
  data,
  actionPath,
}) {
  const startPath = childActionPath.slice(0, actionPath.length);
  if (!isEqual(startPath, actionPath)) { return [action]; }

  const endPath = childActionPath.slice(actionPath.length);

  return data.map((datum, index) => {
    const actionPathA = [...startPath, index, ...endPath];
    return { ...action, actionPath: actionPathA };
  });
};

module.exports = {
  fireResolvers: fireDataResolvers,
};
