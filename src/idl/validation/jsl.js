'use strict';

const { recurseMap } = require('../../utilities');
const { isJsl, validateJsl } = require('../../jsl');

// Validate all IDL JSL expressions
const validateIdlJsl = function ({ idl }) {
  return recurseMap(idl, validateJslMapper);
};

const validateJslMapper = function (jsl) {
  const valIsJsl = isJsl({ jsl });
  if (!valIsJsl) { return jsl; }

  validateJsl({ jsl, type: 'startup' });

  return jsl;
};

module.exports = {
  validateIdlJsl,
};
