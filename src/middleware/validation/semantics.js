'use strict';


const { validate } = require('../../validation');
const { EngineError } = require('../../error');


/**
 * Validate input semantics for all arguments but filter or data
 * E.g. validate that order_by targets existing attributes.
 * Note that order_by has already been syntactically validated
 **/
const validateClientInputSemantics = function ({
  idl,
  modelName,
  dbArgs,
  maxDataLength,
}) {
  const type = 'clientInputSemantics';
  const schema = getSchema({ idl, modelName });
  validate({ schema, data: dbArgs, reportInfo: { type } });

  validateLimits({ dbArgs, maxDataLength });
};

const getSchema = function ({ idl, modelName }) {
  // Validates order_by value against model properties
  const propNames = Object.keys(idl.models[modelName].properties);
  return {
    properties: {
      order_by: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            attrName: {
              type: 'string',
              enum: propNames,
            },
          },
        },
      },
    },
  };
};

// Check input is not too big
const validateLimits = function ({ dbArgs: { data }, maxDataLength: max }) {
  const isDataTooBig = data instanceof Array && data.length > max && max !== 0;
  if (isDataTooBig) {
    const message = `argument 'data' must contain at most ${max} items`;
    throw new EngineError(message, { reason: 'INPUT_LIMIT' });
  }
};


module.exports = {
  validateClientInputSemantics,
};
