'use strict';


const { validateClientInputData, validateServerOutputData } = require('./data');
const { validateServerOutputSyntax } = require('./server_output_syntax');


/**
 * Database validation middleware
 * Checks that input and output conforms to API schema
 * Check for the syntax and the semantics of input and output
 **/
const databaseValidation = function ({ idl }) {
  return async function databaseValidation(input) {
    const { modelName, args, command, jsl, log } = input;
    const perf = log.perf.start('database.validation', 'middleware');

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
