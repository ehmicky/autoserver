'use strict';


const { dereferenceRefs } = require('../utilities');
const { EngineError } = require('../error');


const resolveRefs = async function ({ idl }) {
  try {
    return await dereferenceRefs(idl);
  } catch ({ message }) {
    throw new EngineError(`Could not resolve references '$ref': ${message}`, { reason: 'IDL_SYNTAX_ERROR' });
  }
};


module.exports = {
  resolveRefs,
};
