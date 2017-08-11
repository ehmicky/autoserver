'use strict';

const { getDirectPath } = require('./direct');
const { getConf } = require('./find');
const { validateConfFile } = require('./validate');

// Loads a configuration file which can be:
//  - environment variable API_ENGINE__NAME 'FILE'
//  - runtimeOpts({ NAME: 'FILE' })
//  - api_engine.NAME.json in current directory, or any parent directory
//  - same thing for: api_engine.NAME.yml or api_engine.NAME.yaml
// Relative paths are based on current directory.
const getConfFile = async function ({ path, name }) {
  const pathA = getDirectPath({ path, name });

  const confFile = await getConf({ path: pathA, name });

  const confFileA = validateConfFile({ confFile });

  return confFileA;
};

module.exports = {
  getConfFile,
};
