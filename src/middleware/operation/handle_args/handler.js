'use strict';


const { cloneDeep } = require('lodash');

const { validateArgs } = require('./validate');


// Process client-supplied args: validates them and add them to JSL variables
const handleArgs = function ({ maxDataLength }) {
  return async function handleArgs(input) {
    const { log, args, jsl } = input;
    const perf = log.perf.start('operation.handleArgs', 'middleware');

    const clonedArgs = cloneDeep(args);
    input.jsl = jsl.add({ $ARGS: clonedArgs });

    try {
      validateArgs({ args, maxDataLength });

      perf.stop();
      const response = await this.next(input);
      return response;
    } catch (error) {
      const perf = log.perf.start('operation.handleArgs', 'exception');

      // Added only for final error handler
      log.add({ args: clonedArgs });

      perf.stop();
      throw error;
    }
  };
};


module.exports = {
  handleArgs,
};
