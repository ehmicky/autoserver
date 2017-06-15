'use strict';


const { Jsl } = require('../../jsl');
const { protocolHandlers } = require('../../protocols');


// Converts from no format to Protocol format
const protocolConvertor = function ({ idl: { helpers, exposeMap } }) {
  return async function protocolConvertor(input) {
    const { specific, log, protocol, now } = input;

    const perf = log.perf.start('protocol.convertor', 'middleware');

    const protocolHandler = protocolHandlers[protocol];

    const protocolFullName = protocolHandler.getFullName(input);
    log.add({ protocol, protocolFullName });

    const jsl = new Jsl({ exposeMap });
    const jslWithHelpers = jsl.addHelpers({ helpers });
    const newJsl = jslWithHelpers.add({ $PROTOCOL: protocol });

    const newInput = {
      specific,
      log,
      now,
      protocol,
      protocolHandler,
      protocolFullName,
      jsl: newJsl,
    };

    perf.stop();
    const response = await this.next(newInput);
    return response;
  };
};


module.exports = {
  protocolConvertor,
};
