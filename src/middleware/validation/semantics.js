'use strict';


const { validate } = require('../../utilities');


/**
 * Validate API input semantics for all arguments but filter or data
 * E.g. validate that order_by targets existing attributes. Note that order_by has already been syntactically validated
 **/
const validateClientInputSemantics = function ({ idl, modelName, action, args }) {
  const type = 'clientInputSemantics';
  const schema = getSchema({ idl, modelName });
  const data = getArgs({ args });
  validate({ schema, data, reportInfo: { type, modelName, action } });
};

const getSchema = function ({ idl, modelName }) {
  // Validates order_by value against model properties
  const propNames = Object.keys(idl.models[modelName].properties);
  return {
    properties: {
      order_by: {
        type: 'array',
        items: {
          type: 'string',
          enum: propNames,
        },
      },
    },
  };
};

const getArgs = function ({ args: { order_by: orderBy } }) {
  let args = {};
  if (orderBy) {
    args.order_by = orderBy.replace(/[+-]/g, '').split(',');
  }
  return args;
};


module.exports = {
  validateClientInputSemantics,
};
