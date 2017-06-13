'use strict';


const { Jsl } = require('../../jsl');


// Converts from no format to Protocol format
const protocolConvertor = function ({ idl: { helpers, exposeMap } }) {
  return async function protocolConvertor(input) {
    const { log } = input;

    const perf = log.perf.start('protocol.convertor', 'middleware');

    const jsl = new Jsl({ exposeMap });
    const jslWithHelpers = jsl.addHelpers({ helpers });

    const args = {};

    Object.assign(input, { jsl: jslWithHelpers, args });

    perf.stop();
    const response = await this.next(input);
    return response;
  };
};


module.exports = {
  protocolConvertor,
};
