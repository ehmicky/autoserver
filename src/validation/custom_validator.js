'use strict';

const { addIfv, runIdlFunc } = require('../idl_func');
const { memoize } = require('../utilities');
const { throwError } = require('../error');

const { getValidator, addKeyword } = require('./validator');

// Add custom validation keywords, from idl.validation
const getCustomValidator = function ({ idl: { validation = {} } }) {
  const ajv = getValidator();

  return Object.entries(validation).reduce(
    (ajvB, [keyword, { test: testFunc, message, type }]) =>
      addCustomKeyword({ ajv: ajvB, keyword, testFunc, message, type }),
    ajv,
  );
};

// We do want the re-run if idl.validation changes.
// Serializing the whole IDL as is too slow, so we just take keywords list.
const mGetCustomValidator = memoize(getCustomValidator, {
  serializer: ({ idl: { validation = {} } }) =>
    `${Object.keys(validation).join(',')}`,
});

const addCustomKeyword = function ({ ajv, keyword, testFunc, message, type }) {
  const ajvA = validateCustomKeyword({ ajv, type, keyword });

  return addKeyword({
    ajv: ajvA,
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
        { [Symbol.for('extra')]: ifv }
      ) {
        const params = { $EXPECTED: expected, $$: parent, $: value };
        const ifvA = addIfv(ifv, params);

        const isValid = runIdlFunc({ ifv: ifvA, idlFunc: testFunc });
        if (isValid === true) { return true; }

        const errorMessage = runIdlFunc({ ifv: ifvA, idlFunc: message });
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

const validateCustomKeyword = function ({ ajv, type, keyword }) {
  const isRedundant = Array.isArray(type) &&
    type.includes('number') &&
    type.includes('integer');

  if (isRedundant) {
    const message = `Custom validation keyword 'idl.validation.${keyword}' must not have both types 'number' and 'integer', as 'number' includes 'integer'.`;
    throwError(message, { reason: 'IDL_VALIDATION' });
  }

  return ajv;
};

module.exports = {
  getCustomValidator: mGetCustomValidator,
};
