'use strict';

const Ajv = require('ajv');
const ajvKeywords = require('ajv-keywords');
const { singular, plural } = require('pluralize');

const { memoize } = require('../utilities');

const getRawValidator = memoize(() => {
  const ajv = new Ajv(ajvOptions);
  addKeywords(ajv);
  return ajv;
});
const ajvOptions = {
  allErrors: true,
  jsonPointers: true,
  full: true,
  $data: true,
  verbose: true,
  multipleOfPrecision: 9,
  extendRefs: true,
};

const addKeywords = function (ajv) {
  // Add future JSON standard keywords
  ajvKeywords(ajv, ['if', 'formatMinimum', 'formatMaximum', 'typeof']);

  for (const [name, definition] of Object.entries(customBaseKeywords)) {
    ajv.addKeyword(name, definition);
  }
};

const customBaseKeywords = {

  // Checks that a word (e.g. a model) is an English word with a
  // different singular and plural form
  hasPlural: {
    validate (schemaValue, data) {
      if (!schemaValue) { return true; }
      return singular(data) !== plural(data);
    },
    type: 'string',
    $data: true,
  },

  // Checks function number of arguments
  arity: {
    validate (schemaValue, data) {
      if (typeof data !== 'function') { return true; }
      return data.length === schemaValue;
    },
    $data: true,
  },

  // Checks function return value.
  // Function is fired with no argument, i.e. it must:
  //  - be pure
  //  - always return the same return value type
  //  - return a non-undefined|null return value when fired with
  //    no argument (unless it always returns undefined|null)
  returnType: {
    validate (schemaValue, data) {
      if (typeof data !== 'function') { return true; }
      return typeof data() === schemaValue;
    },
    $data: true,
  },

};

module.exports = {
  getRawValidator,
};
