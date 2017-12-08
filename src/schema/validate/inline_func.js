'use strict';

const { compileInlineFuncs } = require('../../functions');

// Check inline functions are valid by compiling then
const validateInlineFuncs = function ({ schema }) {
  compileInlineFuncs({ schema });
  return schema;
};

module.exports = {
  validateInlineFuncs,
};
