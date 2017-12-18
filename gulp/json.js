'use strict';

// eslint-disable-next-line import/no-internal-modules
const { loadFile, saveFile } = require('../src/formats');

// Stringify YAML files to JSON
const jsonifyFiles = async function () {
  const promises = PATHS.map(jsonifyFile);
  await Promise.all(promises);
};

const PATHS = [
  `${__dirname}/../src/config/reducers/syntax/config_schema.yml`,
  `${__dirname}/../src/middleware/action/validate_args/args_schema.yml`,
  `${__dirname}/../src/middleware/action/validate_args/commands.yml`,
];

const jsonifyFile = async function (path) {
  const content = await loadFile({ path });
  const pathA = path.replace(EXT_REGEXP, '.json');
  await saveFile({ path: pathA, content });
};

// Matches a file extension
const EXT_REGEXP = /\.[a-z0-9]+$/;

module.exports = {
  jsonifyFiles,
};
