'use strict';

const { extname } = require('path');

const { getJson, getYaml } = require('../utilities');
const { getIdl } = require('../idl');

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

// Like `genericLoader`, but also resolves JSON references
const jsonRefLoader = function ({ path }) {
  return getIdl({ idlPath: path });
};

// Loads JavaScript
const jsLoader = function ({ path }) {
  // eslint-disable-next-line import/no-dynamic-require
  return require(path);
};

const loaders = {
  generic: genericLoader,
  jsonRef: jsonRefLoader,
  javascript: jsLoader,
};

module.exports = {
  loadConfFile,
};
