'use strict';

const { genericLoad } = require('../../utilities');

// Load file content, with several supported formats
const loadConfFile = function ({ type, path }) {
  // This means the file is not loaded, i.e. file path left as is
  if (!type) { return path; }

  const loader = loaders[type];
  return loader({ path });
};

// Loads JavaScript
const jsLoader = function ({ path }) {
  // eslint-disable-next-line import/no-dynamic-require
  return require(path);
};

const loaders = {
  generic: genericLoad,
  javascript: jsLoader,
};

module.exports = {
  loadConfFile,
};
