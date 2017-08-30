'use strict';

const { dereferenceIdl } = require('../ref_parser');

const { normalizeIdl } = require('./normalize');

// Load IDL file, using its path
const loadIdl = async function ({ runOpts: { idl } }) {
  // Resolve JSON references
  const { rIdl } = await dereferenceIdl({ idl });
  // Normalize IDL file, and validate it
  const idlA = await normalize({ idl, rIdl });
  return { idl: idlA };
};

const normalize = function ({ idl, rIdl }) {
  // One can compile the IDL file to perform the normalization compile-time
  const isCompiled = idl.endsWith('compiled.json');
  if (isCompiled) { return rIdl; }

  return normalizeIdl({ idl: rIdl });
};

module.exports = {
  loadIdl,
};
