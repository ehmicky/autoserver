'use strict';

const { throwError } = require('../../../error');
const { runSchemaFunc } = require('../../../functions');

// Report log
const report = function ({
  log,
  measures,
  measuresmessage,
  mInput,
  vars,
  opts: { report: reportFunc },
}) {
  if (reportFunc === undefined) { return; }

  validateOpts({ reportFunc });

  const varsA = { vars, log, measures, measuresmessage };
  return runSchemaFunc({ schemaFunc: reportFunc, mInput, vars: varsA });
};

const validateOpts = function ({ reportFunc }) {
  if (typeof reportFunc !== 'function') {
    const message = `Option 'report' for the log provider 'custom' must be a function`;
    throwError(message, { reason: 'SCHEMA_VALIDATION' });
  }
};

module.exports = {
  report,
};
