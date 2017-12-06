'use strict';

const { throwError } = require('../../../error');
const { runSchemaFunc } = require('../../../functions');

// Report log
const report = function ({ opts: { report: reportFunc }, schemaFuncInput }) {
  validateOpts({ reportFunc });

  return runSchemaFunc({ schemaFunc: reportFunc, ...schemaFuncInput });
};

const validateOpts = function ({ reportFunc }) {
  if (reportFunc === undefined || typeof reportFunc !== 'function') {
    const message = `Option 'report' for the log provider 'custom' must be a function`;
    throwError(message, { reason: 'SCHEMA_VALIDATION' });
  }
};

module.exports = {
  report,
};
