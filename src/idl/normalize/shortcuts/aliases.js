'use strict';

const { mapModels } = require('./helper');

// Gets a map of models' attributes' aliases
// e.g. { modelName: { attrName: ['alias', ...], ... }, ... }
const getAliasesMap = function ({ idl: { models } }) {
  return mapModels({ models, filter: 'alias', mapProp });
};

const mapProp = ({ alias }) => (Array.isArray(alias) ? alias : [alias]);

module.exports = {
  getAliasesMap,
};
