'use strict';


const { Jsl } = require('../../../jsl');


// Converts from no format to Protocol format
const protocolConvertor = function ({ idl: { helpers, exposeMap } }) {
  return async function protocolConvertor(input) {
    const jsl = (new Jsl({ exposeMap })).addHelpers({ helpers });
    const nextInput = { jsl, specific: input };

    const response = await this.next(nextInput);
    return response;
  };
};


module.exports = {
  protocolConvertor,
};
