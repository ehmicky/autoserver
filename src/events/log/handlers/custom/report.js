'use strict';

const { throwError } = require('../../../../error');

// Report log
const report = function (vars, opts) {
  validateOpts({ opts });

  const { report: reportFunc } = opts;
  return reportFunc(vars);
};

const validateOpts = function ({ opts }) {
  if (opts.report !== undefined && typeof opts.report !== 'function') {
    const message = `Option 'report' for the log provider 'custom' must be a function`;
    throwError(message, { reason: 'SCHEMA_VALIDATION' });
  }
};

module.exports = {
  report,
};
