'use strict';

const { isEqual } = require('lodash');

const { assignArray } = require('../../../../utilities');

const fireResolvers = async function ({
  actions,
  nextLayer,
  mInput,
  results = [],
}) {
  const [action, ...actionsA] = actions;
  const { actionPath } = action;

  const parentPath = actionPath.slice(0, -1);
  const { data: parent } = results
    .find(({ actionPath: path }) => isEqual(path, parentPath)) || {};
  const data = await fireResolver({ parent, nextLayer, mInput, ...action });
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

const fireResolver = async function ({
  parent,
  ...action
}) {
  if (Array.isArray(parent)) {
    const promises = parent.map(item => resolver({ parent: item, ...action }));
    return Promise.all(promises);
  }

  const result = await resolver({ parent, ...action });
  return result;
};

const resolver = async function ({
  actionName,
  modelName,
  actionConstant: action,
  actionConstant: { multiple },
  actionPath,
  parent = {},
  args,
  nextLayer,
  mInput,
}) {
  const parentVal = parent[actionName];
  const isTopLevel = actionPath.length === 1;

  if (isEmptyAction({ parentVal, isTopLevel })) {
    return multiple ? [] : null;
  }

  const argsA = getNestedArg({ args, action, parentVal, isTopLevel });

  // Fire database layer, retrieving value passed to children
  const mInputA = { ...mInput, action, actionPath, modelName, args: argsA };
  const mInputB = await nextLayer(mInputA);

  return mInputB.response.data;
};

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
  fireResolvers,
};
