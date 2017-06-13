'use strict';


const { validate } = require('../../validation');
const { EngineError } = require('../../error');


/**
 * Operation layer validation
 * Those errors should not happen, i.e. server-side (e.g. 500)
 **/
const operationValidation = function () {
  return async function operationValidation(input) {
    const { operation, route, log } = input;
    const perf = log.perf.start('operation.validation', 'middleware');

    if (!operation) {
      const message = `Unsupported operation: ${route}`;
      throw new EngineError(message, { reason: 'UNSUPPORTED_OPERATION' });
    }

    validate({ schema, data: input, reportInfo });

    perf.stop();
    const response = await this.next(input);
    return response;
  };
};

const schema = {
  type: 'object',
  required: [
    'goal',
    'queryVars',
    'pathVars',
    'params',
    'settings',
    'route',
    'jsl',
    'operation',
  ],
  properties: {
    goal: {
      type: 'string',
      enum: ['find', 'create', 'replace', 'update', 'delete'],
    },
    queryVars: { type: 'object' },
    pathVars: { type: 'object' },
    params: { type: 'object' },
    settings: { type: 'object' },
    route: { type: 'string' },
    jsl: { type: 'object' },
    operation: { type: 'string' },
  },
};
const reportInfo = { type: 'serverInputSyntax', dataVar: 'input' };


module.exports = {
  operationValidation,
};
