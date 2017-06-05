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

      projectName: {
        type: 'string',
        pattern: '^[a-zA-Z0-9_-]+$',
      },

      apiServer: {
        type: 'object',
      },

      logger: {
        typeof: 'function',
      },

      loggerLevel: {
        type: 'string',
        enum: ['info', 'log', 'warn', 'error', 'silent'],
      },

      loggerFilter: {
        type: 'object',
        properties: [
          'payload',
          'response',
          'argData',
          'actionResponses',
          'headers',
          'queryVars',
          'params',
        ].reduce((memo, attrName) => Object.assign(memo, {
          [attrName]: {
            oneOf: [
              {
                type: 'array',
                items: {
                  type: 'string',
                },
              },
              {
                typeof: 'function',
              },
            ],
          },
        }), {}),
        additionalProperties: false,
      },

      startupLog: {
        type: 'object',
        required: ['info', 'log', 'warn', 'error'],
      },

      processLog: {
        type: 'object',
        required: ['info', 'log', 'warn', 'error'],
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
