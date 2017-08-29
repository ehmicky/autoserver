'use strict';

const RefParser = require('json-schema-ref-parser');

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
  return RefParser.dereference(path, refParserOpts);
};

const refParserOpts = {
  resolve: {
    nodeModule: nodeModuleRefs.resolve,
    node: nodeRefs.resolve,
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
};

module.exports = {
  dereferenceRefs,
};
