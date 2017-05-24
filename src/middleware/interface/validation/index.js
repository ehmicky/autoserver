'use strict';


const { validate } = require('../../../validation');
const { EngineError } = require('../../../error');


/**
 * Interface layer validation
 * Those errors should not happen, i.e. server-side (e.g. 500)
 **/
const interfaceValidation = function () {
  return function interfaceValidation(input) {
    const { interface: interf, route } = input;

    if (!interf) {
      const message = `Unsupported interface: ${route}`;
      throw new EngineError(message, { reason: 'UNSUPPORTED_INTERFACE' });
    }

    validate({ schema, data: input, reportInfo });

    const response = this.next(input);
    return response;
  };
};

const schema = {
  type: 'object',
  required: ['method', 'params', 'route', 'jsl', 'interface'],
  properties: {
    method: {
      type: 'string',
      enum: ['find', 'create', 'replace', 'update', 'delete'],
    },
    params: { type: 'object' },
    route: { type: 'string' },
    jsl: { type: 'object' },
    interface: { type: 'string' },
  },
};
const reportInfo = { type: 'serverInputSyntax', dataVar: 'input' };


module.exports = {
  interfaceValidation,
};
