'use strict';

const { getConf } = require('./find');
const { validateConfFile } = require('./validate');
const { getEnvVars } = require('./env');

// Loads a configuration file which can be:
//  - environment variable API_ENGINE__NAME 'FILE'
//  - runtimeOpts({ NAME: 'FILE' })
//  - api_engine.NAME.json in current directory, or any parent directory
//  - same thing for: api_engine.NAME.yml or api_engine.NAME.yaml
// Relative paths are based on current directory.
const getConfFile = async function ({
  path,
  name,
  extNames,
  baseDir,
  useEnvVar,
}) {
  const pathA = loadEnvVar({ path, name, useEnvVar });
  const pathB = await getConf({ path: pathA, name, extNames, baseDir });
  const pathC = validateConfFile({ path: pathB, extNames });
  return pathC;
};

const loadEnvVar = function ({ path, name, useEnvVar }) {
  if (path || !useEnvVar) { return path; }

  const envVars = getEnvVars();
  return envVars[name];
};

module.exports = {
  getConfFile,
};
