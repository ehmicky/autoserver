'use strict';

const { recurseMap } = require('../../utilities');
const { isJsl, validateJsl } = require('../../jsl');

// Validate all IDL JSL expressions
const validateIdlJsl = function ({ idl }) {
  recurseMap(idl, validateJslMapper);
};

const validateJslMapper = function (jsl) {
  const valIsJsl = isJsl({ jsl });
  if (!valIsJsl) { return; }
  validateJsl({ jsl, type: 'startup' });
};

module.exports = {
  validateIdlJsl,
};
