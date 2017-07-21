'use strict';

const mapProp = ({ alias }) => (Array.isArray(alias) ? alias : [alias]);

// Gets a map of models' attributes' aliases
// e.g. { modelName: { attrName: ['alias', ...], ... }, ... }
const aliasesMap = { filter: 'alias', mapProp };

module.exports = {
  aliasesMap,
};
