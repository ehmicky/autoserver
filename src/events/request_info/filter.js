'use strict';

const { pick } = require('../../utilities');

// Apply `runOpts.filter`
const applyFilter = function ({ filter, obj, lowercase }) {
  if (filter === undefined || filter === true) { return obj; }

  if (filter === false) { return; }

  const filterA = setLowercase({ filter, lowercase });
  return pick(obj, filterA);
};

const setLowercase = function ({ filter, lowercase }) {
  if (!lowercase || !Array.isArray(filter)) { return filter; }

  return filter.map(attrName => attrName.toLowerCase());
};

module.exports = {
  applyFilter,
};
