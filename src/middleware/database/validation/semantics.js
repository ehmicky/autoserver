'use strict';


const { validate } = require('../../../validation');


/**
 * Validate input semantics for all arguments but filter or data
 * E.g. validate that `orderBy` targets existing attributes.
 * Note that orderBy has already been syntactically validated
 **/
const validateClientInputSemantics = function ({ idl, modelName, args }) {
  const type = 'clientInputSemantics';
  const schema = getSchema({ idl, modelName });
  validate({ schema, data: args, reportInfo: { type } });
};

const getSchema = function ({ idl, modelName }) {
  // Validates orderBy value against model properties
  const propNames = Object.keys(idl.models[modelName].properties);
  return {
    properties: {
      orderBy: {
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
