'use strict';

const { compileIdlJsl } = require('../../jsl');

// Check JSL is valid by compiling it
const validateJsl = function ({ idl }) {
  compileIdlJsl({ idl });
  return idl;
};

module.exports = {
  validateJsl,
};
