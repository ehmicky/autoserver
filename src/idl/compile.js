'use strict';

const { isEqual } = require('lodash');

const { pWriteFile } = require('../utilities');
const { dereferenceIdl, stringifyWithJsonRefs } = require('../ref_parser');

const { normalizeIdl } = require('./normalize');

// Perform IDL normalization compile-time, in order to speed up startup time.
// This is an optional feature.
// The compiled file will be saved in the same directory as the non-compiled IDL
// with the extension `.compiled.json`
// It will be automatically found when the server starts
const compileIdl = async function ({ path }) {
  const rawIdl = await normalizeIdl({ path });

  const compiledPath = await persistFile({ rawIdl, path });

  validateCompiledIdl({ compiledPath, rawIdl });
};

// Saves the file
const persistFile = async function ({ rawIdl, path }) {
  const compiledIdl = stringifyWithJsonRefs(rawIdl);
  const compiledPath = path.replace(/\.[^.]+$/, '.compiled.json');
  await pWriteFile(compiledPath, compiledIdl, { encoding: 'utf-8' });

  return compiledPath;
};

// Make sure the compiled IDL perfectly matches the non-compiled IDL
const validateCompiledIdl = async function ({ compiledPath, rawIdl }) {
  const compiledIdl = await dereferenceIdl({ path: compiledPath });

  console.log('Verif', isEqual(rawIdl, compiledIdl));
};

module.exports = {
  compileIdl,
};
