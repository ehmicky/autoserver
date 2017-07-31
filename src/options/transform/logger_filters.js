'use strict';

const { pick, mapValues } = require('../../utilities');

const transformLoggerFilters = function (serverOpts) {
  const { loggerFilter } = serverOpts;

  const hasLoggerFilter = loggerFilter && loggerFilter.constructor === Object;
  if (!hasLoggerFilter) { return serverOpts; }

  const loggerFilterA = mapValues(loggerFilter, filter => normFilter(filter));

  return { ...serverOpts, loggerFilter: loggerFilterA };
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
