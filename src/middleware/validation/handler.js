'use strict';


const { getValidator } = require('./validator');
const { getAttributes } = require('./attributes');
const { validateAll } = require('./validate');
const { reportErrors } = require('./report');


const validation = async function ({ idl }) {
  return async function (input) {
    const { modelName, args, operation } = input;

    const validator = getValidator({ idl, modelName, operation });
    const attributes = getAttributes(args);
    const errors = validateAll({ validator, attributes });

    if (errors) {
      reportErrors({ errors });
    }

    const response = await this.next(input);
    return response;
  };
};


module.exports = {
  validation,
};
