'use strict';

const { getRawValidator } = require('../validation');
const { runJsl } = require('../jsl');

const addCustomKeywords = function ({ idl, idl: { validation = {} } }) {
  const ajv = getRawValidator();

  for (const [
    keyword,
    { test: testFunc, message, type },
  ] of Object.entries(validation)) {
    addCustomKeyword({ ajv, keyword, testFunc, message, type, idl });
  }

  return idl;
};

const addCustomKeyword = function ({
  ajv,
  keyword,
  testFunc,
  message,
  type,
  idl,
}) {
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

      const isValid = runJsl({ jsl, value: testFunc, params, idl });
      if (isValid === true) { return true; }

      const errorMessage = runJsl({ jsl, value: message, params, idl });
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
