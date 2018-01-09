'use strict';

const { formatAdapters } = require('./wrap');

// All possible extensions, for documentation
const getExtensions = function () {
  return Object.values(formatAdapters)
    .map(adapter => adapter.wrapped.getExtension())
    .filter(extension => extension !== undefined);
};

const EXTENSIONS = getExtensions();

const CONSTANTS = {
  // Default format for structured types, and unstructure types
  DEFAULT_RAW_FORMAT: formatAdapters.raw.wrapped,
  DEFAULT_FORMAT: formatAdapters.json.wrapped,

  EXTENSIONS,
};

module.exports = CONSTANTS;
