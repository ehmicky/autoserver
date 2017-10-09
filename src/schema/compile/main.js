'use strict';

const { reduceAsync } = require('../../utilities');
const { dereferenceSchema } = require('../../ref_parser');

const { getCompileOpts } = require('./options');
const { normalize } = require('./normalize');
const { persistFile } = require('./persist');
const { validateCompiledSchema } = require('./validate');

// Perform schema normalization compile-time, in order to speed up startup time.
// This is an optional feature.
// The compiled file will be saved in the same directory as the non-compiled
// schema with the extension `.compiled.json`
// It will be automatically found when the server starts
const compileSchema = async function (compileOpts = {}) {
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
  dereferenceSchema,
  normalize,
  persistFile,
  validateCompiledSchema,
];

module.exports = {
  compileSchema,
};
