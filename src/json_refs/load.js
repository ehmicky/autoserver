'use strict';

const { pStat } = require('../utilities');
const { addGenErrorHandler } = require('../error');
const { loadFile } = require('../formats');

// Load the file pointing to by the JSON reference
const load = async function ({ path }) {
  await eStat(path);

  return eLoadFile({ type: 'conf', path });
};

const eLoadFile = addGenErrorHandler(loadFile, {
  message: ({ path }) => `Configuration file could not be parsed because it has syntax errors: '${path}'`,
  reason: 'SCHEMA_VALIDATION',
});

const eStat = addGenErrorHandler(pStat, {
  message: path => `Configuration file does not exist: '${path}'`,
  reason: 'SCHEMA_VALIDATION',
});

module.exports = {
  load,
};
