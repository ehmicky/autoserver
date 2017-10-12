'use strict';

const { extname } = require('path');

const { pReadFile } = require('../promisify');

const { loadJson } = require('./json');
const { loadYaml } = require('./yaml');

// Loads either JSON or YAML.
// This is abstracted to allow easily adding new formats.
// This might throw for many different reasons, e.g. wrong syntax,
// or cannot access file (does not exist or no permissions)
const genericLoad = async function ({ path, content }) {
  const contentA = await getContent({ path, content });

  const fileExt = extname(path);
  const loader = loaders[fileExt] || loadJson;
  return loader({ path, content: contentA });
};

const getContent = function ({ path, content }) {
  if (content !== undefined) { return content; }

  return pReadFile(path, { encoding: 'utf-8' });
};

const loaders = {
  '.json': loadJson,
  '.yml': loadYaml,
  '.yaml': loadYaml,
};

const genericExtNames = ['json', 'yml', 'yaml'];
const genericDescription = 'JSON or YAML';

module.exports = {
  genericLoad,
  genericExtNames,
  genericDescription,
};
