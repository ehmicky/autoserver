'use strict';

const { validate } = require('../validation');
const { assignObject } = require('../utilities');

// Validation for main options
const validateOptions = function (serverOpts) {
  validate({ schema, data: serverOpts, reportInfo });

  return serverOpts;
};

const reportInfo = { type: 'options', dataVar: 'options' };

const logFilterProps = [
  'payload',
  'response',
  'argData',
  'actionResponses',
  'headers',
  'queryVars',
  'params',
  'settings',
];
const logFilterSchema = {
  oneOf: [
    { type: 'array', items: { type: 'string' } },
    { typeof: 'function' },
  ],
};
const logFilterProperties = logFilterProps
  .map(attrName => ({ [attrName]: logFilterSchema }))
  .reduce(assignObject, {});

const schema = {
  type: 'object',
  required: ['conf'],
  properties: {

    conf: {
      type: ['string', 'object'],
    },

    logLevel: {
      type: 'string',
      enum: ['info', 'log', 'warn', 'error', 'silent'],
    },

    logFilter: {
      type: 'object',
      properties: logFilterProperties,
      additionalProperties: false,
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

    serverName: {
      type: 'string',
    },

    http: {
      type: 'object',
      properties: {
        enabled: {
          type: 'boolean',
        },
        host: {
          type: 'string',
        },
        port: {
          type: 'integer',
          minimum: 0,
          maximum: 65535,
        },
      },
      additionalProperties: false,
    },

  },
  additionalProperties: false,
};

module.exports = {
  validateOptions,
};
