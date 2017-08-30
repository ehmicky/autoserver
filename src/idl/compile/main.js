'use strict';

const { reduceAsync } = require('../../utilities');
const { dereferenceIdl } = require('../../ref_parser');

const { getCompileOpts } = require('./options');
const { normalize } = require('./normalize');
const { persistFile } = require('./persist');
const { validateCompiledIdl } = require('./validate');

// Perform IDL normalization compile-time, in order to speed up startup time.
// This is an optional feature.
// The compiled file will be saved in the same directory as the non-compiled IDL
// with the extension `.compiled.json`
// It will be automatically found when the server starts
const compileIdl = async function (compileOpts = {}) {
  const { pPath: path } = await reduceAsync(
    steps,
    (input, step) => step(input),
    { compileOpts },
    (input, newInput) => ({ ...input, ...newInput }),
  );
  return { path };
};

const steps = [
  getCompileOpts,
  dereferenceIdl,
  normalize,
  persistFile,
  validateCompiledIdl,
];

module.exports = {
  compileIdl,
};
