'use strict';

const { getWordsList } = require('../utilities');
const { throwError } = require('../error');
const { generic } = require('../formats');

// Used when JSON reference is wrong
const invalidRef = function ({ url }) {
  const extNamesA = extNames.map(ext => `.${ext}`);
  const extNamesB = getWordsList(extNamesA, { quotes: true });
  const message = `JSON reference '${url}' must point to an existing file, and be valid ${extNamesB}`;
  throwError(message);
};

const extNames = [...generic.extNames, 'js', 'node'];

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
