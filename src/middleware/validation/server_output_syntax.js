'use strict';


const { validate } = require('../../utilities');


// Check API output, for the errors that should not happen, i.e. server-side (e.g. 500)
// In short: response should be an array of objects
const validateServerOutputSyntax = function ({ response }) {
  const type = 'serverOutputSyntax';
  const data = { elem: { response } };
  validate({ schema, data, type });
};

// JSON schema to validate against output
const schema = {
  required: ['response'],
  properties: {
    response: {
      type: 'array',
      items: { type: 'object' },
    },
  },
};


module.exports = {
  validateServerOutputSyntax,
};
