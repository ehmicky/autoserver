'use strict';


const { omit } = require('lodash');

const { getRawValidator } = require('../utilities');
const { EngineError } = require('../error');
const { processJsl } = require('../jsl');


const addCustomKeywords = function ({ idl: { validation } }) {
  const ajv = getRawValidator();
  for (const [keyword, { test, message, type }] of Object.entries(validation)) {
    addCustomKeyword({ ajv, keyword, test, message, type });
  }
};
const addCustomKeyword = function ({ ajv, keyword, test, message, type }) {
  ajv.addKeyword(keyword, {
    validate: function validate(expected, value, _, __, parent, attrName) {
      const siblings = omit(parent, attrName);
      const validationInput = { value, expected, siblings };
      let isValid = false;
      try {
        isValid = processJsl(Object.assign({ jsl: test }, { validationInput }));
      // Throwing an exception in test function behaves the same as returning false
      } catch (e) {/* */}
      if (isValid === true) { return true; }

      let errorMessage;
      try {
        errorMessage = processJsl(Object.assign({ jsl: message }, { validationInput }));
      } catch (innererror) {
        throw new EngineError(`JSL validation message expression failed: ${message.jsl}`, {
          reason: 'UTILITY_ERROR',
          innererror,
        });
      }
      validate.errors = [{
        message: errorMessage,
        keyword,
        params: validationInput,
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
