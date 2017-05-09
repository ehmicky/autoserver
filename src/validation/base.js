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
  // Add custom keywords
  // Checks that a word (e.g. a model) is an English word with a different singular and plural form
  ajv.addKeyword('hasPlural', {
    validate(schemaValue, data) {
      if (!schemaValue) { return true; }
      return singular(data) !== plural(data);
    },
    type: 'string',
    $data: true,
  });
};


module.exports = {
  getRawValidator,
};
