'use strict';


const { getRawValidator } = require('../validation');
const { EngineError } = require('../error');
const { runJsl } = require('../jsl');


const addCustomKeywords = function ({ idl: { validation } }) {
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
      { [Symbol.for('extra')]: extra }
    ) {
      // Input passed by caller in order to fill in JSL variables
      const validationInput = { expected };
      const modelInput = { parent, [extra.shortcutName]: parent, value };
      const jslInput = Object.assign(
        {},
        extra,
        { validationInput, modelInput }
      );
      delete jslInput.shortcutName;

      let isValid = false;
      try {
        isValid = runJsl(test, jslInput);
      } catch (innererror) {
        const message = `JSL validation expression failed: '${test.jsl}'`;
        throw new EngineError(message, { reason: 'UTILITY_ERROR', innererror });
      }
      if (isValid === true) { return true; }

      let errorMessage;
      try {
        errorMessage = runJsl(message, jslInput);
      } catch (innererror) {
        const message = `JSL validation message expression failed: '${message.jsl}'`;
        throw new EngineError(message, { reason: 'UTILITY_ERROR', innererror });
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
