'use strict';


const { dereferenceRefs } = require('../utilities');
const { EngineStartupError } = require('../error');


const resolveRefs = async function ({ idl, baseDir }) {
  const parsedIdl = await resolveJsonRefs({ idl, baseDir });
  const mergedIdl = mergeAllLibraries({ idl: parsedIdl });
  return mergedIdl;
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
    throw new EngineStartupError(message, {
      reason: 'IDL_SYNTAX_ERROR',
      innererror,
    });
  }

  if (currentDir) {
    process.chdir(currentDir);
  }

  return parsedIdl;
};

// Merge idl.helpers.libraries.* into idl.helpers.*
const mergeAllLibraries = function ({ idl }) {
  for (const attrName of librariesAttrs) {
    idl = mergeLibraries({ idl, attrName });
  }
  return idl;
};
const mergeLibraries = function ({ idl, attrName }) {
  if (!idl[attrName] || !idl[attrName].libraries) { return idl; }

  // Each library must an object
  // This translates this array of object into a single object,
  // which is merged into `idl[attrName]`
  if (idl[attrName].libraries instanceof Array) {
    const libraries = idl[attrName].libraries
      .map(library => {
        // If there is any function, it is considered a library,
        // and non-functions are ignored
        const isLibrary = Object.values(library)
          .some(value => typeof value === 'function');
        return Object.entries(library)
          .filter(([, value]) => {
            return !isLibrary ||
              (typeof value === 'function' && Object.keys(value).length === 0);
          })
          .map(([name, value]) => ({ [name]: value }))
          .reduce((memo, val) => Object.assign(memo, val), {});
      })
      .reduce((memo, val) => Object.assign(memo, val), {});
    idl[attrName] = Object.assign({}, libraries, idl[attrName]);
  }

  delete idl[attrName].libraries;

  return idl;
};
// Which attributes in idl.* can use libraries
const librariesAttrs = ['helpers'];


module.exports = {
  resolveRefs,
};
