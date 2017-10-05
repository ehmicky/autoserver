'use strict';

const { compileIdlFuncs } = require('../../../idl_func');

// Check inline functions are valid by compiling then
const validateInlineFuncs = function ({ idl }) {
  compileIdlFuncs({ idl });
  return idl;
};

module.exports = {
  validateInlineFuncs,
};
