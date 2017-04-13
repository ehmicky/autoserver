'use strict';


const { validate } = require('../../utilities');
const { operations } = require('../../idl');


// Check API output, for the errors that should not happen, i.e. server-side (e.g. 500)
// In short: response should be an array of objects
const validateServerOutputSyntax = function ({ operation, response }) {
  const type = 'serverOutputSyntax';
  const multiple = operations.find(op => op.name === operation).multiple;
  const schema = getSchema({ multiple });
  validate({ schema, data: { response }, reportInfo: { type } });
};

// JSON schema to validate against output
const getSchema = function ({ multiple }) {
  const responseDef = multiple ? { type: 'array', items: { type: 'object' } } : { type: 'object' };
  return {
    required: ['response'],
    properties: {
      response: responseDef,
    },
  };
};


module.exports = {
  validateServerOutputSyntax,
};
