'use strict';

const { extname } = require('path');

const { getJson, getYaml } = require('../utilities');

// Load file content, with several supported formats
const loadConfFile = async function ({ type, path }) {
  const loader = loaders[type];
  const content = await loader({ path });
  return content;
};

// Loads either JSON or YAML
const genericLoader = async function ({ path }) {
  const fileExt = extname(path);
  const content = await genericLoaders[fileExt]({ path });
  return content;
};

const genericLoaders = {
  '.json': getJson,
  '.yml': getYaml,
  '.yaml': getYaml,
};

// Loads JavaScript
const jsLoader = function ({ path }) {
  // eslint-disable-next-line import/no-dynamic-require
  return require(path);
};

const loaders = {
  generic: genericLoader,
  javascript: jsLoader,
};

module.exports = {
  loadConfFile,
};
