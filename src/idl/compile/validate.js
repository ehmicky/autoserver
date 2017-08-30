'use strict';

const { isEqual } = require('lodash');

const { throwError } = require('../../error');
const { dereferenceIdl } = require('../../ref_parser');

// Make sure the compiled IDL perfectly matches the non-compiled IDL
const validateCompiledIdl = async function ({ pPath, cIdl }) {
  const { rIdl } = await dereferenceIdl({ idl: pPath });

  const hasMismatch = !isEqual(rIdl, cIdl);

  if (hasMismatch) {
    const message = 'Compiled IDL do not match the non-compiled version';
    throwError(message, { reason: 'UTILITY_ERROR' });
  }
};

module.exports = {
  validateCompiledIdl,
};
