'use strict';

const { pStat } = require('../utilities');
const { addGenErrorHandler, addErrorHandler } = require('../errors');
const { getByExt, DEFAULT_RAW_FORMAT } = require('../formats');

// Load the file pointing to by the JSON reference
const load = async function ({ path }) {
  // Checks that the file exists
  await eStat(path);

  const format = eGetByExt({ path });
  const content = await eLoadFile({ format, path });

  return content;
};

const eStat = addGenErrorHandler(pStat, {
  message: path => `Config file does not exist: '${path}'`,
  reason: 'CONFIG_VALIDATION',
});

const eGetByExt = addErrorHandler(getByExt, () => DEFAULT_RAW_FORMAT);

const loadFile = function ({ format, path }) {
  return format.parseFile(path, { compat: false });
};

const eLoadFile = addGenErrorHandler(loadFile, {
  message: ({ path }) => `Config file could not be parsed: '${path}'`,
  reason: 'CONFIG_VALIDATION',
});

module.exports = {
  load,
};
