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
  let currentDir;
  if (baseDir) {
    currentDir = process.cwd();
    process.chdir(baseDir);
  }

  let parsedIdl;
  try {
    parsedIdl = await dereferenceRefs(idl);
  } catch (innererror) {
    const message = 'Could not resolve references \'$ref\'';
    throw new EngineError(message, {
      reason: 'IDL_SYNTAX_ERROR',
      innererror,
    });
  }

  if (currentDir) {
    process.chdir(currentDir);
  }

  return parsedIdl;
};

module.exports = {
  resolveRefs,
};
