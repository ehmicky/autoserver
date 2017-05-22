'use strict';


const { validateClientInputSyntax } = require('./client_input_syntax');
const { validateClientInputCommand } = require('./client_input_command');
const { validateClientInputSemantics } = require('./semantics');
const { validateClientInputData, validateServerOutputData } = require('./data');
const { validateServerOutputSyntax } = require('./server_output_syntax');


/**
 * API validation layer
 * Checks that input and output conforms to API schema
 * Check for the syntax and the semantics of input and output
 **/
const validation = function ({ idl, maxDataLength }) {
  return async function validation(input) {
    const { modelName, args, sysArgs, command, jslInput } = input;

    validateClientInputSyntax({ command, args });
    validateClientInputCommand({ idl, command, modelName, sysArgs });
    validateClientInputSemantics({ idl, modelName, args, maxDataLength });
    validateClientInputData({ idl, modelName, command, args, jslInput });

    const response = await this.next(input);
    validateServerOutputSyntax({ command, response });
    validateServerOutputData({
      idl,
      modelName,
      response,
      command,
      args,
      jslInput,
    });

    return response;
  };
};


module.exports = {
  validation,
};
