'use strict';


const { processJsl } = require('../jsl');


const handleFilter = async function () {
  return await function (input) {
    const { args } = input;

    if (args.filter) {
      // Temporary hack until we add support for proper MongoDB objects
      args.filter = processJsl({ value: args.filter, processor: ({ value }) => ({ eval: value }) });
    }

    const response = this.next(input);
    return response;
  };
};


module.exports = {
  handleFilter,
};
