'use strict';

const { basename, dirname } = require('path');

const RefParser = require('json-schema-ref-parser');

const { getYaml } = require('./yaml');

/**
 * Dereference JSON references.
 * RFC: https://tools.ietf.org/id/draft-pbryan-zyp-json-ref-03.html
 * I.e. { $ref: "path|url" } will be replaced by the target, which can be
 * accessed locally (local path) or remotely (HTTP[S])
 * Targets can be JSON or YAML files.
 * Circular references are supported.
 * Siblings attributes to `$ref` will be merged (with higher priority),
 * although this is not standard|spec behavior.
 * This function might throw for several reasons, e.g. YAML|JSON parsing error,
 * cannot access remote|local file, etc.
 */
const dereferenceRefs = async function (obj) {
  const dereferencedObj = await RefParser.dereference(obj, {
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
        async parse ({ data }) {
          const content = Buffer.isBuffer(data) ? data.toString() : data;
          if (typeof content !== 'string') { return content; }

          // `content` cannot be `null` because of a bug
          // with `json-schema-ref-parser`
          const yamlContent = await getYaml({ content }) || undefined;
          return yamlContent;
        },
      },
      text: false,
      binary: false,
      nodeModule: nodeModuleRefs.parse,
      node: nodeRefs.parse,
    },
  });
  return dereferencedObj;
};

// Allow referencing Node.js modules, e.g. { "$ref": "lodash" }
const nodeModuleRefs = {
  resolve: {
    order: 50,
    canRead: true,
    read: ({ url }) => requireFile(basename(url)),
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
    read: ({ url }) => requireFile(url),
  },
  parse: {
    allowEmpty: false,
    order: 600,
    canParse: '.js',
    parse: ({ data }) => (isResolved(data) ? data : undefined),
  },
};

// Enhanced version of `require()`
const requireFile = function (url) {
  // The new required file's require() calls should be relative to the file
  // itself, so we temporarily change cwd
  const currenDir = process.cwd();
  process.chdir(dirname(url));

  try {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    return require(url);
  } finally {
    process.chdir(currenDir);
  }
};

// Make sure a `resolve` function has previously been called
const isResolved = val => typeof val !== 'string' && !Buffer.isBuffer(val);

module.exports = {
  dereferenceRefs,
};
