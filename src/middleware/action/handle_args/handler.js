'use strict';


const { cloneDeep } = require('lodash');

const { validateSyntax } = require('./validate_syntax');
const { validateLimits } = require('./validate_limits');
const { renameArgs } = require('./rename');


// Process client-supplied args: validates them and add them to JSL variables
// Also rename them camelcase
const handleArgs = function ({ serverOpts: { maxDataLength } }) {
  return async function handleArgs(input) {
    const { log, args, jsl, action } = input;
    const perf = log.perf.start('operation.handleArgs', 'middleware');

    const clonedArgs = cloneDeep(args);

    try {
      input.jsl = jsl.add({ $ARGS: clonedArgs });

      validateSyntax({ args, action, maxDataLength });
      validateLimits({ args, maxDataLength });
      input.args = renameArgs({ args });

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
