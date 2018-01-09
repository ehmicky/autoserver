'use strict';

const { formatAdapters } = require('./wrap');

// All possible extensions, for documentation
const getExtNames = function () {
  return Object.values(formatAdapters)
    .map(getExtName)
    .filter(extName => extName !== undefined);
};

// Retrieve format's prefered extension
const getExtName = function ({ extNames: [extName] = [] }) {
  if (extName === undefined) { return; }

  return `.${extName}`;
};

const EXT_NAMES = getExtNames();

const CONSTANTS = {
  // Default format for structured types, and unstructure types
  DEFAULT_RAW_FORMAT: formatAdapters.raw.wrapped,
  DEFAULT_FORMAT: formatAdapters.json.wrapped,

  EXT_NAMES,
};

module.exports = CONSTANTS;
