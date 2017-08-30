'use strict';

const { isEqual } = require('lodash');

const {
  normalizeError,
  getStandardError,
  rethrowError,
  throwError,
} = require('../error');
const { pWriteFile } = require('../utilities');
const { getOptions } = require('../options');
const { dereferenceIdl, stringifyWithJsonRefs } = require('../ref_parser');

const { normalizeIdl } = require('./normalize');

// Perform IDL normalization compile-time, in order to speed up startup time.
// This is an optional feature.
// The compiled file will be saved in the same directory as the non-compiled IDL
// with the extension `.compiled.json`
// It will be automatically found when the server starts
const compileIdl = async function (compileOpts = {}) {
  const { options: compileOptsA } = await getOptions({
    instruction: 'compile',
    options: compileOpts,
  });
  const { idl: path } = compileOptsA;
  const idl = await dereferenceIdl({ path });
  const rawIdl = await normalizeIdl({ idl });

  const compiledPath = await persistFile({ rawIdl, path });

  await validateCompiledIdl({ compiledPath, rawIdl });

  return { path: compiledPath };
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

  const hasMismatch = !isEqual(rawIdl, compiledIdl);

  if (hasMismatch) {
    const message = 'Compiled IDL do not match the non-compiled version';
    throwError(message, { reason: 'UTILITY_ERROR' });
  }
};

// Compile error handler
const handleCompileError = function (func) {
  return async (input, ...args) => {
    try {
      return await func(input, ...args);
    } catch (error) {
      const errorA = await normalizeError({ error });
      const errorB = await getStandardError({ error: errorA });

      rethrowError(errorB);
    }
  };
};

const eCompileIdl = handleCompileError(compileIdl);

module.exports = {
  compileIdl: eCompileIdl,
};
