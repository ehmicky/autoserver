'use strict';


const { Jsl } = require('../../../jsl');
const { LogInfo } = require('../../../logging');


// Converts from no format to Protocol format
const protocolConvertor = function ({ idl: { helpers, exposeMap } }) {
  return async function protocolConvertor(input) {
    const jsl = new Jsl({ exposeMap });
    const jslWithHelpers = jsl.addHelpers({ helpers });

    const logInfo = new LogInfo();

    const nextInput = { jsl: jslWithHelpers, specific: input, logInfo };

    const response = await this.next(nextInput);
    return response;
  };
};


module.exports = {
  protocolConvertor,
};
