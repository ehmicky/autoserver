'use strict';

const { pick } = require('../../../utilities');

// Apply `serverOpts.logFilter`
const applyLogFilter = function ({ logFilter, obj }) {
  if (logFilter === undefined || logFilter === true) { return obj; }

  if (logFilter === false) { return; }

  return pick(obj, logFilter);
};

module.exports = {
  applyLogFilter,
};
