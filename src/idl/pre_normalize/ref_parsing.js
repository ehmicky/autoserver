'use strict';

const { dereferenceRefs, omit } = require('../../utilities');
const { throwError } = require('../../error');

const resolveRefs = async function ({ idl, baseDir }) {
  const parsedIdl = await resolveJsonRefs({ idl, baseDir });
  return parsedIdl;
};

// Resolve JSON references, i.e. $ref
const resolveJsonRefs = async function ({ idl }) {
  try {
    const currentDir = enterDir({ idl });
    const parsedIdl = await dereferenceRefs(idl);
    leaveDir({ currentDir });

    return omit(parsedIdl, 'baseDir');
  } catch (error) {
    const message = 'Could not resolve references \'$ref\'';
    throwError(message, {
      reason: 'IDL_SYNTAX_ERROR',
      innererror: error,
    });
  }
};

// Make $ref relative to IDL file itself
const enterDir = function ({ idl: { baseDir } }) {
  if (!baseDir) { return; }

  const currentDir = process.cwd();
  process.chdir(baseDir);

  return currentDir;
};

const leaveDir = function ({ currentDir }) {
  if (!currentDir) { return; }

  process.chdir(currentDir);
};

module.exports = {
  resolveRefs,
};
