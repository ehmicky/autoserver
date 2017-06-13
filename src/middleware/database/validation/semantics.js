'use strict';


const { validate } = require('../../../validation');


/**
 * Validate input semantics for all arguments but filter or data
 * E.g. validate that `nOrderBy` targets existing attributes.
 * Note that nOrderBy has already been syntactically validated
 **/
const validateClientInputSemantics = function ({ idl, modelName, args }) {
  const type = 'clientInputSemantics';
  const schema = getSchema({ idl, modelName });
  validate({ schema, data: args, reportInfo: { type } });
};

const getSchema = function ({ idl, modelName }) {
  // Validates nOrderBy value against model properties
  const propNames = Object.keys(idl.models[modelName].properties);
  return {
    properties: {
      nOrderBy: {
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
