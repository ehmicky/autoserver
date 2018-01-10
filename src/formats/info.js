'use strict';

const formatAdapters = require('./adapters');
const { getExtension } = require('./extensions');

// All possible extensions, for documentation
const getExtensions = function () {
  return formatAdapters
    .map(formatAdapter => getExtension(formatAdapter))
    .filter(extension => extension !== undefined);
};

const EXTENSIONS = getExtensions();

module.exports = {
  EXTENSIONS,
};
