'use strict';

const { throwError } = require('../error');
const { genericExtNames } = require('../utilities');

// Used when JSON reference is wrong
const invalidRef = function ({ url }) {
  const extNames = genericExtNames.map(ext => `.${ext}`).join(', ');
  const message = `JSON reference '${url}' must point to an existing file, and be valid ${extNames}, .js or .node`;
  throwError(message);
};

const errorRefs = {
  resolve: {
    order: 300,
    canRead: true,
    read: invalidRef,
  },
  parse: {
    order: 700,
    canParse: true,
    parse: invalidRef,
  },
};

module.exports = {
  errorRefs,
};
