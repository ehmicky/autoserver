'use strict';


const { processJsl } = require('../jsl');


// Transform `filter` argument into a format that is easily manageable for the database layer
const handleFilter = async function () {
  return async function (input) {
    const { args } = input;

    if (args.filter) {
      // Temporary hack until we add support for proper MongoDB objects
      args.filter = processJsl({ value: args.filter, processor: ({ value }) => ({ eval: `(${value})` }) });
    }

    const response = await this.next(input);
    return response;
  };
};


module.exports = {
  handleFilter,
};
