'use strict';

const { compileSchemaFuncs } = require('../../../schema_func');

// Check inline functions are valid by compiling then
const validateInlineFuncs = function ({ schema }) {
  compileSchemaFuncs({ schema });
  return schema;
};

module.exports = {
  validateInlineFuncs,
};
