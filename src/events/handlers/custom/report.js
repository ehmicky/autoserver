'use strict';

const { throwError } = require('../../../error');
const { runSchemaFunc } = require('../../../schema_func');

// Report log
const report = function ({
  logInfo,
  measures,
  measuresmessage,
  mInput,
  vars,
  opts,
}) {
  validateOpts({ opts });

  const { report: reportFunc } = opts;
  const varsA = { vars, log: logInfo, measures, measuresmessage };
  return runSchemaFunc({ schemaFunc: reportFunc, mInput, vars: varsA });
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
