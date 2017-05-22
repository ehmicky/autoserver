'use strict';


const { protocolValidation } = require('./validation');


// Converts from no format to Protocol format
const protocolConvertor = function () {
  return async function protocolConvertor(input) {
    const info = {};
    const jslInput = {};
    const protocol = { specific: input };
    const nextInput = { info, jslInput, protocol };

    protocolValidation({ input: nextInput });

    const response = await this.next(nextInput);
    return response;
  };
};


module.exports = {
  protocolConvertor,
};
