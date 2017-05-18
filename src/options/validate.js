'use strict';


const { validate } = require('../validation');


// Validation for main options
const validateOptions = function ({ options }) {
  const schema = {
    type: 'object',
    required: ['conf'],
    properties: {

      conf: {
        type: ['string', 'object'],
      },

      onRequestError: {
        typeof: 'function',
        arity: 1,
      },

      logger: {
        typeof: 'function',
        returnType: 'function',
        arity: 1,
      },

      maxDataLength: {
        type: 'integer',
        minimum: 0,
      },

      defaultPageSize: {
        type: 'integer',
        minimum: 0,
      },

      maxPageSize: {
        type: 'integer',
        minimum: {
          $data: '1/defaultPageSize',
        },
      },

    },
    additionalProperties: false,
  };

  const reportInfo = { type: 'options', dataVar: 'options' };
  validate({ schema, data: options, reportInfo });
};


module.exports = {
  validateOptions,
};
