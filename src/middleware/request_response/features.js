'use strict';

const { addGenErrorHandler } = require('../../errors');

// Validate database supports command features
const validateRuntimeFeatures = function ({
  args,
  collname,
  clientCollname,
  dbAdapters,
}) {
  const dbAdapter = dbAdapters[collname];
  return dbAdapter.validateRuntimeFeatures({ args, clientCollname });
};

const eValidateRuntimeFeatures = addGenErrorHandler(validateRuntimeFeatures, {
  reason: 'VALIDATION',
});

module.exports = {
  validateRuntimeFeatures: eValidateRuntimeFeatures,
};
