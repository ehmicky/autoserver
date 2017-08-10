'use strict';

const { basename } = require('path');

const RefParser = require('json-schema-ref-parser');

const { loadYaml } = require('./yaml');

// Dereference JSON references.
// RFC: https://tools.ietf.org/id/draft-pbryan-zyp-json-ref-03.html
// I.e. { $ref: "path|url" } will be replaced by the target, which can be
// accessed locally (local path) or remotely (HTTP[S])
// Each $ref is relative to the current file.
// Targets can be JSON or YAML files.
// Circular references are not supported.
// Siblings attributes to `$ref` will be merged (with higher priority),
// although this is not standard|spec behavior.
// This function might throw for several reasons, e.g. YAML|JSON parsing error,
// cannot access remote|local file, etc.
const dereferenceRefs = async function ({ path }) {
  const dereferencedObj = await RefParser.dereference(path, {
    resolve: {
      nodeModule: nodeModuleRefs.resolve,
      node: nodeRefs.resolve,
    },
    parse: {
      json: {
        allowEmpty: false,
      },
      yaml: {
        allowEmpty: false,
        // We need to override YAML parsing, as we use stricter YAML
        // parsing (CORE_SCHEMA only)
        async parse ({ data, url }) {
          const content = Buffer.isBuffer(data) ? data.toString() : data;
          if (typeof content !== 'string') { return content; }

          const yamlContent = await loadYaml({ path: url, content });

          // `content` cannot be `null` because of a bug
          // with `json-schema-ref-parser`
          if (yamlContent === null) { return; }

          return yamlContent;
        },
      },
      text: false,
      binary: false,
      nodeModule: nodeModuleRefs.parse,
      node: nodeRefs.parse,
    },
    dereference: {
      circular: true,
    },
  });
  return dereferencedObj;
};

// Allow referencing Node.js modules, e.g. { "$ref": "lodash" }
const nodeModuleRefs = {
  resolve: {
    order: 50,
    canRead: true,
    // eslint-disable-next-line import/no-dynamic-require
    read: ({ url }) => require(basename(url)),
  },
  parse: {
    allowEmpty: false,
    order: 500,
    canParse: true,
    parse: ({ data }) => (isResolved(data) ? data : undefined),
  },
};

// Allow referencing JavaScript files, e.g. { "$ref": "./my_file.js" }
const nodeRefs = {
  resolve: {
    order: 60,
    canRead: '.js',
    // eslint-disable-next-line import/no-dynamic-require
    read: ({ url }) => require(url),
  },
  parse: {
    allowEmpty: false,
    order: 600,
    canParse: '.js',
    parse: ({ data }) => (isResolved(data) ? data : undefined),
  },
};

// Make sure a `resolve` function has previously been called
const isResolved = function (val) {
  return typeof val !== 'string' && !Buffer.isBuffer(val);
};

module.exports = {
  dereferenceRefs,
};
