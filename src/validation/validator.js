'use strict';

const Ajv = require('ajv');
const ajvKeywords = require('ajv-keywords');

const { memoize } = require('../utilities');

const getValidator = function () {
  const ajv = new Ajv(ajvOptions);
  const ajvA = addKeywords(ajv);
  return ajvA;
};

const mGetValidator = memoize(getValidator);

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

  return Object.entries(customBaseKeywords).reduce(
    (ajvA, [keyword, def]) => addKeyword({ keyword, def, ajv: ajvA }),
    ajv,
  );
};

const addKeyword = function ({ ajv, keyword, def }) {
  ajv.addKeyword(keyword, def);
  return ajv;
};

const customBaseKeywords = {

  // Checks function number of arguments
  arity: {
    validate (schemaValue, data) {
      if (typeof data !== 'function') { return true; }
      return data.length === schemaValue;
    },
    $data: true,
  },

};

module.exports = {
  getValidator: mGetValidator,
  addKeyword,
};
