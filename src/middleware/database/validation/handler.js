'use strict';


const { validateClientInputSyntax } = require('./client_input_syntax');
const { validateClientInputCommand } = require('./client_input_command');
const { validateClientInputSemantics } = require('./semantics');
const { validateClientInputData, validateServerOutputData } = require('./data');
const { validateServerOutputSyntax } = require('./server_output_syntax');


/**
 * Database validation layer
 * Checks that input and output conforms to API schema
 * Check for the syntax and the semantics of input and output
 **/
const databaseValidation = function ({ idl, maxDataLength }) {
  return async function databaseValidation(input) {
    const { modelName, args, sysArgs, command, jsl, log } = input;
    const perf = log.perf.start('database.validation', 'middleware');

    validateClientInputSyntax({ command, args });
    validateClientInputCommand({ idl, command, modelName, sysArgs });
    validateClientInputSemantics({ idl, modelName, args, maxDataLength });
    validateClientInputData({ idl, modelName, command, args, jsl });

    perf.stop();
    const response = await this.next(input);
    perf.start();

    validateServerOutputSyntax({ command, response });
    validateServerOutputData({ idl, modelName, response, command, jsl });

    perf.stop();
    return response;
  };
};


module.exports = {
  databaseValidation,
};
