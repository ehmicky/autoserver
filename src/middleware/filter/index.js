'use strict';


const { compileJsl } = require('../../jsl');
const { recurseMap } = require('../../utilities');


// Transform `filter` argument into a format that is easily manageable
// for the database layer
const handleFilter = function ({ idl }) {
  return async function handleFilter(input) {
    const { args } = input;

    if (args.filter) {
      // Temporary hack until we add support for proper MongoDB objects
      args.filter = recurseMap(args.filter, jsl => {
        return compileJsl({ jsl, idl, target: 'filter' });
      });
    }

    const response = await this.next(input);
    return response;
  };
};


module.exports = {
  handleFilter,
};
