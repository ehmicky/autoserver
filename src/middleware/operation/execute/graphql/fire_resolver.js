'use strict';

const { isEqual } = require('lodash');

const { assignArray } = require('../../../../utilities');

const { resolver } = require('./resolver');

const fireResolvers = async function ({
  actions,
  nextLayer,
  responses,
  mInput,
  mInput: { idl: { shortcuts: { modelsMap } } },
  results = [],
}) {
  if (actions.length === 0) { return results; }

  const [{ actionPath, actionName, args, select }, ...actionsA] = actions;

  const parentPath = actionPath.slice(0, -1);
  const { data: parent } = results
    .find(({ actionPath: path }) => isEqual(path, parentPath)) || {};
  const data = await fireResolver({
    modelsMap,
    name: actionName,
    parent,
    args,
    nextLayer,
    mInput,
    responses,
  });
  const result = getResult({ data, actionPath, select });
  const actionsB = getActions({ actions: actionsA, data, actionPath });
  const resultsA = [...results, ...result];
  return fireResolvers({
    actions: actionsB,
    nextLayer,
    responses,
    mInput,
    results: resultsA,
  });
};

const fireResolver = async function ({
  modelsMap,
  name,
  parent,
  args,
  nextLayer,
  mInput,
  responses,
}) {
  if (Array.isArray(parent)) {
    const promises = parent.map(item => fireResolver({
      modelsMap,
      name,
      parent: item,
      args,
      nextLayer,
      mInput,
      responses,
    }));
    return Promise.all(promises);
  }

  const result = await resolver({
    modelsMap,
    name,
    parent,
    args,
    nextLayer,
    mInput,
    responses,
    fireNext,
  });
  return result;
};

const getResult = function ({ data, actionPath, select }) {
  if (!Array.isArray(data)) {
    return [{ data, actionPath, select }];
  }

  return data.map((datum, index) => ({
    data: datum,
    actionPath: [...actionPath, index],
    select,
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

const fireNext = async function ({
  nextLayer,
  mInput,
  responses,
  action,
  fullAction,
  modelName,
  args,
}) {
  const mInputA = { ...mInput, action, fullAction, modelName, args };

  const mInputB = await nextLayer(mInputA);

  // eslint-disable-next-line fp/no-mutating-methods
  responses.push(mInputB);

  return mInputB.response;
};

module.exports = {
  fireResolvers,
};
