'use strict';

const { dereferenceRefs } = require('../utilities');
const { EngineError } = require('../error');

const resolveRefs = async function ({ idl, baseDir }) {
  const parsedIdl = await resolveJsonRefs({ idl, baseDir });
  return parsedIdl;
};

// Resolve JSON references, i.e. $ref
const resolveJsonRefs = async function ({ idl, baseDir }) {
  // Make $ref relative to IDL file itself
  const currentDir = process.cwd();

  if (baseDir) {
    process.chdir(baseDir);
  }

  try {
    const parsedIdl = await dereferenceRefs(idl);
    return parsedIdl;
  } catch (error) {
    const message = 'Could not resolve references \'$ref\'';
    throw new EngineError(message, {
      reason: 'IDL_SYNTAX_ERROR',
      innererror: error,
    });
  } finally {
    if (baseDir) {
      process.chdir(currentDir);
    }
  }
};

module.exports = {
  resolveRefs,
};
