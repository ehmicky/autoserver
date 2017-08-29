'use strict';

const { basename } = require('path');

const { addJsonRefSym } = require('./stringify');

// Allow referencing Node.js modules, e.g. { "$ref": "lodash.node" }
const nodeModuleRefs = {
  resolve: rootDir => ({
    order: 50,
    canRead: '.node',
    read ({ url }) {
      const baseName = basename(url);
      const name = baseName.replace(/\.node$/, '');
      return load({ name, url, rootDir });
    },
  }),
  parse: {
    allowEmpty: false,
    order: 500,
    // `resolve` function has already parsed it
    canParse: ({ data, extension }) =>
      extension === '.node' && isResolved(data),
    parse: ({ data }) => Promise.resolve(data),
  },
};

// Allow referencing JavaScript files, e.g. { "$ref": "./my_file.js" }
const nodeRefs = {
  resolve: rootDir => ({
    order: 60,
    canRead: '.js',
    read: ({ url }) => load({ name: url, url, rootDir }),
  }),
  parse: {
    allowEmpty: false,
    order: 600,
    // `resolve` function has already parsed it
    canParse: ({ data, extension }) =>
      extension === '.js' && isResolved(data),
    parse: ({ data }) => Promise.resolve(data),
  },
};

const load = function ({ name, url, rootDir }) {
  // eslint-disable-next-line import/no-dynamic-require
  const obj = require(name);
  const objA = addJsonRefSym({ obj, url, rootDir });
  return objA;
};

// Make sure a `resolve` function has previously been called
const isResolved = function (val) {
  return typeof val !== 'string' && !Buffer.isBuffer(val);
};

module.exports = {
  nodeModuleRefs,
  nodeRefs,
};
