'use strict';


const { getIdl } = require('../idl');
const { validate } = require('../validation');


const processOptions = async function (options) {
  options = applyDefaultOptions({ options });

  validateOptions({ options });

  const idl = await getIdl({ conf: options.conf });
  Object.assign(options, { idl });

  return options;
};

// Default value for main options
const applyDefaultOptions = function ({ options }) {
  return Object.assign({}, defaultOptions, options);
};
const defaultOptions = {
  maxDataLength: 1000,
};

// Validation for main options
const validateOptions = function ({ options }) {
  const schema = {
    type: 'object',
    required: ['conf'],
    properties: {
      conf: {
        type: ['string', 'object'],
      },
      onRequestError: {
        typeof: 'function',
        arity: 1,
      },
      logger: {
        typeof: 'function',
        returnType: 'function',
        arity: 1,
      },
      maxDataLength: {
        type: 'integer',
        minimum: 0,
      },
    },
    additionalProperties: false,
  };

  validate({ schema, data: options, reportInfo: { type: 'options' } });
};


module.exports = {
  processOptions,
};
