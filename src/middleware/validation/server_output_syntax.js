'use strict';


const { validate } = require('../../validation');
const { commands } = require('../../idl');


// Check API output, for the errors that should not happen,
// i.e. server-side (e.g. 500)
// In short: response should be an array of objects
const validateServerOutputSyntax = function ({ commandName, response }) {
  const type = 'serverOutputSyntax';
  const { multiple } = commands.find(({ name }) => name === commandName);
  const schema = getSchema({ multiple });
  validate({ schema, data: response, reportInfo: { type } });
};

// JSON schema to validate against output
const getSchema = function ({ multiple }) {
  const responseDef = multiple
    ? { type: 'array', items: { type: 'object' } }
    : { type: 'object' };
  return {
    required: ['data', 'metadata'],
    properties: {
      data: responseDef,
      metadata: {},
    },
    // Metadata has the same signature as data, i.e. object or array of objects
    allOf: [
      {
        properties: {
          if: {
            data: {
              type: 'object'
            },
            metadata: {
              type: 'object'
            },
          },
        },
      },
      {
        properties: {
          if: {
            data: {
              type: 'array'
            },
            metadata: {
              type: 'array'
            },
          },
        },
      },
    ],
    additionalProperties: false,
  };
};


module.exports = {
  validateServerOutputSyntax,
};
