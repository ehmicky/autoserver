'use strict';


const { dereferenceRefs } = require('../utilities');
const { EngineStartupError } = require('../error');


const resolveRefs = async function ({ idl, baseDir }) {
  // Make $ref relative to IDL file itself
  let currentDir;
  if (baseDir) {
    currentDir = process.cwd();
    process.chdir(baseDir);
  }

  let parsedIdl;
  try {
    parsedIdl = await dereferenceRefs(idl);
  } catch (innererror) {
    throw new EngineStartupError('Could not resolve references \'$ref\'', { reason: 'IDL_SYNTAX_ERROR', innererror });
  }

  if (currentDir) {
    process.chdir(currentDir);
  }

  return parsedIdl;
};


module.exports = {
  resolveRefs,
};
