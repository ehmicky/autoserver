'use strict';

const { pick } = require('../utilities');

// Transform main options
const transformOptions = function (serverOpts) {
  const { loggerFilter } = serverOpts;
  const hasLoggerFilter = loggerFilter && loggerFilter.constructor === Object;

  if (hasLoggerFilter) {
    transformLoggerFilters(loggerFilter);
  }

  return serverOpts;
};

const transformLoggerFilters = function (filters) {
  for (const [name, filter] of Object.entries(filters)) {
    filters[name] = transformLoggerFilter(filter);
  }
};

const transformLoggerFilter = function (filter) {
  const isShortcut = Array.isArray(filter) &&
    filter.every(attrName => typeof attrName === 'string');
  return isShortcut
    ? obj => pick(obj, filter)
    : filter;
};

module.exports = {
  transformOptions,
};
