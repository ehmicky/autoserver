'use strict';


const { validate } = require('../validation');
const { assignObject } = require('../utilities');


// Validation for main options
const validateOptions = function ({ serverOpts, startupLog }) {
  const perf = startupLog.perf.start('validate', 'options');

  validate({ schema, data: serverOpts, reportInfo });

  perf.stop();
};

const reportInfo = { type: 'options', dataVar: 'options' };

const loggerFilterProps = [
  'payload',
  'response',
  'argData',
  'actionResponses',
  'headers',
  'queryVars',
  'params',
  'settings',
];
const loggerFilterSchema = {
  oneOf: [
    { type: 'array', items: { type: 'string' } },
    { typeof: 'function' },
  ],
};
const loggerFilterProperties = loggerFilterProps
  .map(attrName => ({ [attrName]: loggerFilterSchema }))
  .reduce(assignObject, {});

const schema = {
  type: 'object',
  required: ['conf'],
  properties: {

    conf: {
      type: ['string', 'object'],
    },

    loggerLevel: {
      type: 'string',
      enum: ['info', 'log', 'warn', 'error', 'silent'],
    },

    loggerFilter: {
      type: 'object',
      properties: loggerFilterProperties,
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
