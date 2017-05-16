'use strict';


const { compileJsl } = require('../../jsl');
const { EngineError } = require('../../error');


// Transform `filter` argument into a format that is easily manageable
// for the database layer
const handleFilter = async function ({ idl }) {
  return async function handleFilter(input) {
    const { args } = input;

    if (args.filter) {
      // Temporary hack until we add support for proper MongoDB objects
      try {
        args.filter = compileJsl({ jsl: args.filter, idl, target: 'filter' });
      } catch (innererror) {
        const message = `JSL syntax error: ${JSON.stringify(args.filter)}`;
        throw new EngineError(message, {
          reason: 'INPUT_VALIDATION',
          innererror,
        });
      }
    }

    const response = await this.next(input);
    return response;
  };
};


module.exports = {
  handleFilter,
};
