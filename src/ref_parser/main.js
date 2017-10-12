'use strict';

const { dirname } = require('path');

const RefParser = require('json-schema-ref-parser');

const { addGenErrorHandler } = require('../error');

const { genericRefs } = require('./generic');
const { nodeModuleRefs, nodeRefs } = require('./javascript');
const { errorRefs } = require('./error');

// Dereference JSON references.
// RFC: https://tools.ietf.org/id/draft-pbryan-zyp-json-ref-03.html
// I.e. { $ref: "path|url" } will be replaced by the target, which can be
// accessed locally (local path) or remotely (HTTP[S])
// Each $ref is relative to the current file.
// Siblings attributes to `$ref` will be merged (with higher priority),
// although this is not standard|spec behavior.
// This function might throw for several reasons, e.g. parsing error,
// cannot access remote|local file, etc.
const dereferenceRefs = function ({ path }) {
  const rootDir = dirname(path);
  const refParserOpts = getRefParserOpts(rootDir);
  return RefParser.dereference(path, refParserOpts);
};

const getRefParserOpts = rootDir => ({
  resolve: {
    nodeModule: nodeModuleRefs.resolve(rootDir),
    node: nodeRefs.resolve(rootDir),
    error: errorRefs.resolve,
  },
  // Targets can be a generic configuration format,
  // or JavaScript (include Node.js modules)
  parse: {
    generic: genericRefs,
    nodeModule: nodeModuleRefs.parse,
    node: nodeRefs.parse,
    error: errorRefs.parse,
    // This is replaced by `generic`
    yaml: false,
    json: false,
    // We only want structured information
    text: false,
    binary: false,
  },
  // Circular references are not supported.
  dereference: {
    circular: false,
  },
});

// Resolve JSON references, i.e. $ref
// json-schema-ref-parser must load the file itself, i.e. a string must be
// passed to it, not the parsed object, so it knows the base of relative $refs.
// Because of this, json-schema-ref-parser needs to be responsible for loading
// and parsing the schema.
const dereferenceSchema = async function ({ schema }) {
  const rSchema = await dereferenceRefs({ path: schema });
  return { rSchema };
};

const eDereferenceSchema = addGenErrorHandler(dereferenceSchema, {
  message: 'Could not resolve references \'$ref\'',
  reason: 'SCHEMA_SYNTAX_ERROR',
});

module.exports = {
  dereferenceSchema: eDereferenceSchema,
};
