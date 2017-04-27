'use strict';


const { compileJsl } = require('../../jsl');
const { EngineError } = require('../../error');


// Transform `filter` argument into a format that is easily manageable for the database layer
const handleFilter = async function () {
  return async function (input) {
    const { args } = input;

    if (args.filter) {
      // Temporary hack until we add support for proper MongoDB objects
      try {
        args.filter = compileJsl({ jsl: args.filter });
      } catch (innererror) {
        throw new EngineError(`JSL syntax error: ${JSON.stringify(args.filter)}`, { reason: 'INPUT_VALIDATION', innererror });
      }
    }

    const response = await this.next(input);
    return response;
  };
};


module.exports = {
  handleFilter,
};
