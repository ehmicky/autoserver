'use strict';


const { getValidator } = require('./validator');
const { getAttributes } = require('./attributes');
const { validateAll } = require('./validate');
const { reportErrors } = require('./report');


const validation = async function ({ idl }) {
  return async function (input) {
    const { modelName, args, operation } = input;
    validateInput({ idl, modelName, args, operation, direction: 'input' });

    const response = await this.next(input);
    validateOutput({ idl, modelName, response, operation, direction: 'output' });

    return response;
  };
};

// Validates input, e.g. query arguments or data input
const validateInput = function ({ idl, modelName, args, operation, direction }) {
  const validator = getValidator({ idl, modelName, operation, direction });
  const attributes = getAttributes(args);
  const errors = validateAll({ validator, attributes });

  if (errors.length > 0) {
    reportErrors({ errors, direction });
  }
};

// Validates output, e.g. if the database is corrupted
const validateOutput = function ({ idl, modelName, response, operation, direction }) {
  const validator = getValidator({ idl, modelName, operation, direction });
  const attributes = response.map(response => ({ attrs: response, argName: 'response' }));
  const errors = validateAll({ validator, attributes });

  if (errors.length > 0) {
    reportErrors({ errors, direction });
  }
};


module.exports = {
  validation,
};
