'use strict';

const { pStat } = require('../utilities');
const { addGenErrorHandler } = require('../error');
const { loadFile } = require('../formats');

// Load the file pointing to by the JSON reference
const load = async function ({ path }) {
  // Checks that the file exists
  await eStat(path);

  const content = await eLoadFile({ path, compat: false });

  return content;
};

const eLoadFile = addGenErrorHandler(loadFile, {
  message: ({ path }) =>
    `Config file could not be parsed because it has syntax errors: '${path}'`,
  reason: 'CONF_VALIDATION',
});

const eStat = addGenErrorHandler(pStat, {
  message: path => `Config file does not exist: '${path}'`,
  reason: 'CONF_VALIDATION',
});

module.exports = {
  load,
};
