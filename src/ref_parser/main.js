'use strict';

const { dirname } = require('path');

const RefParser = require('json-schema-ref-parser');

const { addGenErrorHandler } = require('../error');

const { jsonRefs } = require('./json');
const { yamlRefs } = require('./yaml');
const { nodeModuleRefs, nodeRefs } = require('./javascript');
const { errorRefs } = require('./error');

// Dereference JSON references.
// RFC: https://tools.ietf.org/id/draft-pbryan-zyp-json-ref-03.html
// I.e. { $ref: "path|url" } will be replaced by the target, which can be
// accessed locally (local path) or remotely (HTTP[S])
// Each $ref is relative to the current file.
// Siblings attributes to `$ref` will be merged (with higher priority),
// although this is not standard|spec behavior.
// This function might throw for several reasons, e.g. YAML|JSON parsing error,
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
  // Targets can be JSON, YAML or JavaScript (include Node.js modules)
  parse: {
    json: jsonRefs.parse,
    yaml: yamlRefs.parse,
    nodeModule: nodeModuleRefs.parse,
    node: nodeRefs.parse,
    error: errorRefs.parse,
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
// and parsing the IDL file.
const dereferenceIdl = addGenErrorHandler(dereferenceRefs, {
  message: 'Could not resolve references \'$ref\'',
  reason: 'IDL_SYNTAX_ERROR',
});

module.exports = {
  dereferenceIdl,
};
