'use strict';


const { validateInputData } = require('./input');
const { validateOutputData } = require('./output');


/**
 * Custom data validation middleware
 * Checks that input and output conforms to API schema
 **/
const dataValidation = function () {
  return async function databaseValidation(input) {
    const { modelName, args, command, jsl, log, idl } = input;
    const perf = log.perf.start('database.validation', 'middleware');

    validateInputData({ idl, modelName, command, args, jsl });

    perf.stop();
    const response = await this.next(input);
    perf.start();

    validateOutputData({ idl, modelName, response, command, jsl });

    perf.stop();
    return response;
  };
};


module.exports = {
  dataValidation,
};
