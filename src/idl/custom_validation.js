'use strict';


const { getRawValidator } = require('../validation');


const addCustomKeywords = function ({ idl: { validation = {} } }) {
  const ajv = getRawValidator();
  for (const [keyword, { test, message, type }] of Object.entries(validation)) {
    addCustomKeyword({ ajv, keyword, test, message, type });
  }
};
const addCustomKeyword = function ({ ajv, keyword, test, message, type }) {
  ajv.addKeyword(keyword, {
    validate: function validate(
      expected,
      value,
      _,
      __,
      parent,
      attrName,
      { [Symbol.for('extra')]: jsl }
    ) {
      const input = { EXPECTED: expected, $$: parent, $: value };

      const isValid = jsl.run({ value: test, input });
      if (isValid === true) { return true; }

      const errorMessage = jsl.run({ value: message, input });
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
