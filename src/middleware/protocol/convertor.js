'use strict';


const { Jsl } = require('../../jsl');
const { EngineError } = require('../../error');


// Converts from no format to Protocol format
const protocolConvertor = function ({ idl: { helpers, exposeMap } }) {
  return async function protocolConvertor(input) {
    const { specific = {}, log, protocol, protocolHandler, now } = input;

    const perf = log.perf.start('protocol.convertor', 'middleware');

    if (!specific || specific.constructor !== Object) {
      const message = `'specific' must be an object, not ${specific}`;
      throw new EngineError(message, { reason: 'SERVER_INPUT_VALIDATION' });
    }

    const protocolFullName = protocolHandler.getFullName({ specific });
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
