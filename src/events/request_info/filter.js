'use strict';

const { pick } = require('../../utilities');

// Apply `runOpts.filter`
const applyFilter = function ({ filter, obj }) {
  if (filter === undefined || filter === true) { return obj; }

  if (filter === false) { return; }

  return pick(obj, filter);
};

module.exports = {
  applyFilter,
};
