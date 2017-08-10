'use strict';

const { getDirectPath } = require('./direct');
const { getConfFile } = require('./find');
const { loadConfFile } = require('./load');

// Loads a configuration file which can be:
//  - environment variable API_ENGINE__NAME 'FILE'
//  - serverOpts({ NAME: 'FILE' })
//  - .api_engine.NAME.json in current directory, or any parent directory
//  - same thing for: .api_engine.NAME.yml or .api_engine.NAME.yaml
// Relative paths are based on current directory.
const getConf = async function ({ path, name }) {
  const pathA = getDirectPath({ path, name });

  const confFile = await getConfFile({ path: pathA, name });
  if (!confFile) { return {}; }

  const confOpts = await loadConfFile({ confFile });
  return confOpts;
};

module.exports = {
  getConf,
};
