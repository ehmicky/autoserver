'use strict';

const { throwError } = require('../../../error');
const { runConfigFunc } = require('../../../functions');

// Report log
const report = function ({ opts: { report: reportFunc }, configFuncInput }) {
  validateOpts({ reportFunc });

  return runConfigFunc({ configFunc: reportFunc, ...configFuncInput });
};

const validateOpts = function ({ reportFunc }) {
  if (reportFunc === undefined || typeof reportFunc !== 'function') {
    const message = `Option 'report' for the log provider 'custom' must be a function`;
    throwError(message, { reason: 'CONF_VALIDATION' });
  }
};

module.exports = {
  report,
};
