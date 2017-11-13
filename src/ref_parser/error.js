'use strict';

const { getWordsList } = require('../utilities');
const { throwError } = require('../error');
const { getExtNames } = require('../formats');

// Used when JSON reference is wrong
const invalidRef = function ({ url }) {
  const extNamesA = EXT_NAMES.map(ext => `.${ext}`);
  const extNamesB = getWordsList(extNamesA, { quotes: true });
  const message = `JSON reference '${url}' must point to an existing file, and be valid ${extNamesB}`;
  throwError(message);
};

const EXT_NAMES = [...getExtNames('conf'), 'js', 'node'];

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
