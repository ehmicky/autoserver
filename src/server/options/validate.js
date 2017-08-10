'use strict';

const { validate } = require('../../validation');

// Validation for main options
const validateOptions = function (serverOpts) {
  validate({ schema, data: serverOpts, reportInfo });

  return serverOpts;
};

const reportInfo = { type: 'options', dataVar: 'options' };

const logFilterSchema = {
  oneOf: [
    { type: 'array', items: { type: 'string' } },
    { type: 'boolean' },
  ],
};

const schema = {
  type: 'object',
  properties: {

    env: {
      type: 'string',
      enum: ['dev', 'production'],
    },

    logLevel: {
      type: 'string',
      enum: ['info', 'log', 'warn', 'error', 'silent'],
    },

    logFilter: {
      type: 'object',
      properties: {
        payload: logFilterSchema,
        response: logFilterSchema,
        argData: logFilterSchema,
        actionResponses: logFilterSchema,
        headers: logFilterSchema,
        queryVars: logFilterSchema,
        params: logFilterSchema,
        settings: logFilterSchema,
      },
      additionalProperties: false,
    },

    serverName: {
      type: 'string',
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
