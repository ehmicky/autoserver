'use strict';

const { mapValues, pickBy } = require('../../utilities');

// Gets a map of models' attributes' aliases
// e.g. { modelName: { attrName: ['alias', ...], ... }, ... }
const getAliasesMap = function ({ idl: { models } }) {
  return mapValues(models, ({ properties = {} }) => {
    const propsWithAlias = pickBy(properties, ({ alias }) => alias);
    return mapValues(propsWithAlias, ({ alias }) => {
      return Array.isArray(alias) ? alias : [alias];
    });
  });
};

module.exports = {
  getAliasesMap,
};
