'use strict';

const { reduceAsync } = require('../../../../utilities');

const fireResolvers = function ({ actions, contextValue, resolver }) {
  return reduceAsync(
    actions,
    async (results, { actionPath, actionName, args, select }) => {
      const parentPath = actionPath
        .split('.')
        .slice(0, -1)
        .join('.');
      const { data: parent } = results
        .find(({ actionPath: path }) => path === parentPath) || {};
      const data = await fireResolver({
        resolver,
        name: actionName,
        parent,
        args,
        contextValue,
      });
      const result = { data, actionPath, select };
      return [...results, result];
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

module.exports = {
  fireResolvers,
};
