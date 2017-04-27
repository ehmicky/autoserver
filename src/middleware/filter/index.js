'use strict';


const { compileJsl } = require('../../jsl');


// Transform `filter` argument into a format that is easily manageable for the database layer
const handleFilter = async function () {
  return async function (input) {
    const { args } = input;

    if (args.filter) {
      // Temporary hack until we add support for proper MongoDB objects
      args.filter = compileJsl({ jsl: args.filter });
    }

    const response = await this.next(input);
    return response;
  };
};


module.exports = {
  handleFilter,
};
