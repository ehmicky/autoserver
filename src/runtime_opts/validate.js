'use strict';

const { validate } = require('../validation');
const { ALL_TYPES } = require('../events');
const { assignObject } = require('../utilities');

// Validation for runtime options
const validateRuntimeOpts = function ({ runtimeOpts }) {
  validate({ schema, data: runtimeOpts, reportInfo });

  return { runtimeOpts };
};

const reportInfo = { type: 'runtimeOpts', dataVar: 'runtimeOpts' };

const eventFilterSchema = {
  oneOf: [
    { type: 'array', items: { type: 'string' } },
    { type: 'boolean' },
  ],
};

const eventProperty = { typeof: 'function' };

const eventsProperties = ALL_TYPES
  .map(type => ({ [type]: eventProperty }))
  .reduce(assignObject, {});

const schema = {
  type: 'object',
  properties: {

    env: {
      type: 'string',
      enum: ['dev', 'production'],
    },

    events: {
      type: 'object',
      properties: eventsProperties,
      additionalProperties: false,
    },

    eventLevel: {
      type: 'string',
      enum: ['info', 'log', 'warn', 'error', 'silent'],
    },

    eventFilter: {
      type: 'object',
      properties: {
        payload: eventFilterSchema,
        response: eventFilterSchema,
        argData: eventFilterSchema,
        actionResponses: eventFilterSchema,
        headers: eventFilterSchema,
        queryVars: eventFilterSchema,
        params: eventFilterSchema,
        settings: eventFilterSchema,
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
  validateRuntimeOpts,
};
