'use strict';

const { isEqual } = require('lodash');

const { reduceAsync } = require('../../../../utilities');

const fireResolvers = function ({ actions, contextValue, resolver }) {
  return reduceAsync(
    actions,
    async (results, { actionPath, actionName, args, select }) => {
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
      return [...results, ...result];
    },
    [],
  );
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

module.exports = {
  fireResolvers,
};
