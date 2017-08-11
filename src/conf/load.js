'use strict';

const { extname } = require('path');

const { getJson, getYaml } = require('../utilities');

// Load file content, with several supported formats: JSON, YAML
const loadConfFile = async function ({ path }) {
  const fileExt = extname(path).slice(1);
  const loader = loaders[fileExt];

  const content = await loader({ path });
  return content;
};

const loaders = {
  json: getJson,
  yml: getYaml,
  yaml: getYaml,
};

module.exports = {
  loadConfFile,
};
