'use strict';

const { pick, mapValues } = require('../../utilities');

const transformLoggerFilters = function (serverOpts) {
  const { logFilter } = serverOpts;

  const hasLoggerFilter = logFilter && logFilter.constructor === Object;
  if (!hasLoggerFilter) { return serverOpts; }

  const logFilterA = mapValues(logFilter, filter => normFilter(filter));

  return { ...serverOpts, logFilter: logFilterA };
};

const normFilter = function (filter) {
  const isShortcut = Array.isArray(filter) &&
    filter.every(attrName => typeof attrName === 'string');
  if (!isShortcut) { return filter; }

  return obj => pick(obj, filter);
};

module.exports = {
  transformLoggerFilters,
};
