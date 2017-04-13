'use strict';


const { validateServerInputSyntax } = require('./server_input_syntax');
const { validateClientInputSyntax } = require('./client_input_syntax');
const { validateClientInputMethod } = require('./client_input_method');
const { validateClientInputSemantics } = require('./semantics');
const { validateClientInputData, validateServerOutputData } = require('./data');
const { validateServerOutputSyntax } = require('./server_output_syntax');


/**
 * API validation layer
 * Checks that input and output conforms to API schema
 * Check for the syntax and the semantics of input and output
 **/
const validation = async function ({ idl }) {
  return async function (input) {
    const { modelName, args, operation } = input;
    validateServerInputSyntax({ idl, modelName, operation, args });
    validateClientInputSyntax({ modelName, operation, args });
    validateClientInputMethod({ idl, modelName, operation });
    validateClientInputSemantics({ idl, modelName, operation, args });
    validateClientInputData({ idl, modelName, operation, args });

    const response = await this.next(input);
    validateServerOutputSyntax({ operation, response });
    validateServerOutputData({ idl, modelName, response, operation });

    return response;
  };
};


module.exports = {
  validation,
};
