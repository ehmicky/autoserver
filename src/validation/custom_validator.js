'use strict';

const { runJsl } = require('../jsl');
const { memoize } = require('../utilities');

const { getValidator, addKeyword } = require('./validator');

// Add custom validation keywords, from idl.validation
const getCustomValidator = function ({ idl, idl: { validation = {} } }) {
  const ajv = getValidator();

  return Object.entries(validation).reduce(
    (ajvB, [keyword, { test: testFunc, message, type }]) =>
      addCustomKeyword({ ajv: ajvB, keyword, testFunc, message, type, idl }),
    ajv,
  );
};

// We do want the re-run if idl.validation changes.
// Serializing the whole IDL as is too slow, so we just take keywords list.
const mGetCustomValidator = memoize(getCustomValidator, {
  serializer: ({ idl: { validation = {} } }) =>
    `${Object.keys(validation).join(',')}`,
});

const addCustomKeyword = function ({
  ajv,
  keyword,
  testFunc,
  message,
  type,
  idl,
}) {
  return addKeyword({
    ajv,
    keyword,
    def: {
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
        // eslint-disable-next-line fp/no-mutation
        validate.errors = [{
          message: errorMessage,
          keyword,
          params: { expected },
        }];
        return false;
      },
      type,
      $data: true,
    },
  });
};

module.exports = {
  getCustomValidator: mGetCustomValidator,
};
