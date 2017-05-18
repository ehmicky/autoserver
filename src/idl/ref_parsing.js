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
    throw new EngineStartupError('Could not resolve references \'$ref\'', { reason: 'IDL_SYNTAX_ERROR', innererror });
  }

  if (currentDir) {
    process.chdir(currentDir);
  }

  return parsedIdl;
};

// Merge idl.helpers|variables.libraries.* into idl.helpers|variables.*
const mergeAllLibraries = function ({ idl }) {
  for (const { attrName, filterFunc } of librariesAttrs) {
    idl = mergeLibraries({ idl, attrName, filterFunc });
  }
  return idl;
};
const mergeLibraries = function ({ idl, attrName, filterFunc = () => true }) {
  if (!idl[attrName] || !idl[attrName].libraries) { return idl; }

  if (idl[attrName].libraries instanceof Array) {
    // Each library must an object of functions (non-functions are ignored)
    // This translate this array of object of functions into a single object, which is merged into `idl[attrName]`
    const libraries = idl[attrName].libraries
      .map(library => Object.entries(library)
        .filter(([_, value]) => filterFunc(value))
        .map(([name, value]) => ({ [name]: value }))
        .reduce((memo, val) => Object.assign(memo, val), {})
      )
      .reduce((memo, val) => Object.assign(memo, val), {})
    idl[attrName] = Object.assign({}, libraries, idl[attrName]);
  }

  delete idl[attrName].libraries;

  return idl;
};
// Which attributes in idl.* can use libraries
const librariesAttrs = [
  // Libraries like Lodash or underscore.string are objects that can be used as functions as well
  { attrName: 'helpers', filterFunc: value => typeof value === 'function' && Object.keys(value).length === 0 },
  { attrName: 'variables' },
];


module.exports = {
  resolveRefs,
};
