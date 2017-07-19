'use strict';

const { getRawValidator } = require('../validation');

const addCustomKeywords = function ({ idl, idl: { validation = {} } }) {
  const ajv = getRawValidator();

  for (const [
    keyword,
    { test: testFunc, message, type },
  ] of Object.entries(validation)) {
    addCustomKeyword({ ajv, keyword, testFunc, message, type });
  }

  return idl;
};

const addCustomKeyword = function ({ ajv, keyword, testFunc, message, type }) {
  ajv.addKeyword(keyword, {
    // eslint-disable-next-line max-params
    validate: function validate (
      expected,
      value,
      _,
      __,
      parent,
      attrName,
      { [Symbol.for('extra')]: jsl }
    ) {
      const params = { $EXPECTED: expected, $$: parent, $: value };

      const isValid = jsl.run({ value: testFunc, params });
      if (isValid === true) { return true; }

      const errorMessage = jsl.run({ value: message, params });
      validate.errors = [{
        message: errorMessage,
        keyword,
        params: { expected },
      }];
      return false;
    },
    type,
    $data: true,
  });
};

module.exports = {
  addCustomKeywords,
};
