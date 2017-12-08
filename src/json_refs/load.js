'use strict';

const { addGenErrorHandler } = require('../error');
const { loadFile } = require('../formats');

// Load the file pointing to by the JSON reference
const load = function ({ path }) {
  return loadFile({ type: 'conf', path });
};

const eLoad = addGenErrorHandler(load, {
  message: ({ path }) => `JSON reference '${path}' is invalid: this file does not exist or has syntax errors`,
  reason: 'SCHEMA_SYNTAX_ERROR',
});

module.exports = {
  load: eLoad,
};
