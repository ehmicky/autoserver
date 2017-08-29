'use strict';

const { basename } = require('path');

// Allow referencing Node.js modules, e.g. { "$ref": "lodash.node" }
const nodeModuleRefs = {
  resolve: {
    order: 50,
    canRead: '.node',
    read ({ url }) {
      const name = basename(url);
      const moduleName = name.replace(/\.node$/, '');
      // eslint-disable-next-line import/no-dynamic-require
      return require(moduleName);
    },
  },
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
  resolve: {
    order: 60,
    canRead: '.js',
    // eslint-disable-next-line import/no-dynamic-require
    read: ({ url }) => require(url),
  },
  parse: {
    allowEmpty: false,
    order: 600,
    // `resolve` function has already parsed it
    canParse: ({ data, extension }) => extension === '.js' && isResolved(data),
    parse: ({ data }) => Promise.resolve(data),
  },
};

// Make sure a `resolve` function has previously been called
const isResolved = function (val) {
  return typeof val !== 'string' && !Buffer.isBuffer(val);
};

module.exports = {
  nodeModuleRefs,
  nodeRefs,
};
