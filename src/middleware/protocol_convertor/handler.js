'use strict';


const { protocolValidation } = require('./validation');


const protocolConvertor = function () {
  return async function protocolConvertor(input) {
    protocolValidation({ input });

    const response = await this.next(input);
    return response;
  };
};


module.exports = {
  protocolConvertor,
};
