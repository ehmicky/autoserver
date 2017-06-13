'use strict';


const { validate } = require('../../../validation');


/**
 * Validate input semantics for all arguments but filter or data
 * E.g. validate that order_by targets existing attributes.
 * Note that order_by has already been syntactically validated
 **/
const validateClientInputSemantics = function ({ idl, modelName, args }) {
  const type = 'clientInputSemantics';
  const schema = getSchema({ idl, modelName });
  validate({ schema, data: args, reportInfo: { type } });
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


module.exports = {
  validateClientInputSemantics,
};
