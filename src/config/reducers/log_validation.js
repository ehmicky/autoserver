'use strict';

const { logAdapters } = require('../../log');

const { validateAdaptersOpts } = require('./adapter_opts');

// Validates `log.LOG.*`
const validateLogs = function ({ config: { log } }) {
  log.forEach(validateLog);
};

const validateLog = function ({ provider, opts }) {
  const optsA = { [provider]: opts };
  validateAdaptersOpts({ opts: optsA, adapters: logAdapters, key: 'log' });
};

module.exports = {
  validateLogs,
};
