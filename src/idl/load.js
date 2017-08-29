'use strict';

const { dereferenceIdl } = require('../ref_parser');

const { normalizeIdl } = require('./normalize');

// Load IDL file, using its path
const loadIdl = async function ({ runOpts: { idl: path } }) {
  // Resolve JSON references
  const idl = await dereferenceIdl({ path });
  // Normalize IDL file, and validate it
  const idlA = await normalize({ path, idl });
  return { idl: idlA };
};

const normalize = function ({ path, idl }) {
  // One can compile the IDL file to perform the normalization compile-time
  const isCompiled = path.endsWith('compiled.json');
  if (isCompiled) { return idl; }

  return normalizeIdl({ idl });
};

module.exports = {
  loadIdl,
};
