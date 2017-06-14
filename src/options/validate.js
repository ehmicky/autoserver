'use strict';


const { validate } = require('../validation');
const { assignObject } = require('../utilities');


// Validation for main options
const validateOptions = function ({ options }) {
  const perf = options.startupLog.perf.start('validate', 'options');

  validate({ schema, data: options, reportInfo });

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

    projectName: {
      type: 'string',
      pattern: '^[a-zA-Z0-9_-]+$',
    },

    apiServer: {
      type: 'object',
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


module.exports = {
  validateOptions,
};
