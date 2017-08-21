'use strict';

const { getConf } = require('./find');
const { validateConfFile } = require('./validate');
const { loadConfFile } = require('./load');

// Loads a configuration file which can be:
//  - COMMAND({ NAME: 'FILE' })
//  - api_engine.NAME.json in current directory, or any parent directory
//  - same thing for: api_engine.NAME.yml or api_engine.NAME.yaml
// Relative paths are based on current directory.
const getConfFile = async function ({ path, name, extNames, baseDir, loader }) {
  const pathA = await getConf({ path, name, extNames, baseDir });
  const pathB = validateConfFile({ path: pathA, extNames });
  if (!pathB) { return {}; }

  const content = await loadConfFile({ type: loader, path: pathB });
  return { path: pathB, content };
};

module.exports = {
  getConfFile,
};
