'use strict';

const { getConf } = require('./find');
const { validateConfFile } = require('./validate');
const { loadConfFile } = require('./load');

// Loads a configuration file which can be:
//  - INSTRUCTION({ NAME: 'FILE' })
//  - api_engine.NAME.EXT in current directory, or any parent directory
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
