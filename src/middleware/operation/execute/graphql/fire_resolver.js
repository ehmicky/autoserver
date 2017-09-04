'use strict';

const { isEqual } = require('lodash');

const { assignArray } = require('../../../../utilities');

const fireResolvers = async function ({
  actions,
  contextValue,
  resolver,
  results = [],
}) {
  if (actions.length === 0) { return results; }

  const [{ actionPath, actionName, args, select }, ...actionsA] = actions;

  const parentPath = actionPath.slice(0, -1);
  const { data: parent } = results
    .find(({ actionPath: path }) => isEqual(path, parentPath)) || {};
  const data = await fireResolver({
    resolver,
    name: actionName,
    parent,
    args,
    contextValue,
  });
  const result = getResult({ data, actionPath, select });
  const actionsB = getActions({ actions: actionsA, data, actionPath });
  const resultsA = [...results, ...result];
  return fireResolvers({
    results: resultsA,
    actions: actionsB,
    contextValue,
    resolver,
  });
};

const fireResolver = async function ({
  resolver,
  name,
  parent,
  args,
  contextValue,
}) {
  if (Array.isArray(parent)) {
    const promises = parent.map(
      item => fireResolver({ resolver, name, parent: item, args, contextValue })
    );
    return Promise.all(promises);
  }

  const result = await resolver({ name, parent, args, context: contextValue });
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

module.exports = {
  fireResolvers,
};
