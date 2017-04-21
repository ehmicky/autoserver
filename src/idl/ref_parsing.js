'use strict';


const { dereferenceRefs } = require('../utilities');
const { EngineStartupError } = require('../error');


const resolveRefs = async function ({ idl }) {
  try {
    return await dereferenceRefs(idl);
  } catch (innererror) {
    throw new EngineStartupError('Could not resolve references \'$ref\'', { reason: 'IDL_SYNTAX_ERROR', innererror });
  }
};


module.exports = {
  resolveRefs,
};
