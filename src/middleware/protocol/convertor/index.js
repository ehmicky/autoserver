'use strict';


const { Jsl } = require('../../../jsl');


// Converts from no format to Protocol format
const protocolConvertor = function ({ idl: { helpers, exposeMap } }) {
  return async function protocolConvertor(input) {
    const jsl = new Jsl({ exposeMap });
    const jslWithHelpers = jsl.addHelpers({ helpers });

    Object.assign(input, { jsl: jslWithHelpers });

    const response = await this.next(input);
    return response;
  };
};


module.exports = {
  protocolConvertor,
};
