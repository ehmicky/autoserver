'use strict';

const { addGenErrorHandler } = require('../error');
const { loadFile } = require('../formats');

// Load the file pointing to by the JSON reference
const load = function ({ path }) {
  return loadFile({ type: 'conf', path });
};

const eLoad = addGenErrorHandler(load, {
  message: ({ path }) => `Configuration file '${path}' is invalid: it does not exist or it has syntax errors`,
  reason: 'SCHEMA_VALIDATION',
});

module.exports = {
  load: eLoad,
};
