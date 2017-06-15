'use strict';


// Fill in:
//  - `input.method`: protocol-specific method, e.g. 'POST'
//  - `input.goal`: protocol-agnostic method, e.g. 'create'
// Meant to be used by operation layer.
const parseMethod = function () {
  return async function parseMethod(input) {
    const { specific, protocolHandler, log } = input;
    const perf = log.perf.start('protocol.parseMethod', 'middleware');

    const method = protocolHandler.getMethod({ specific });
    const goal = protocolHandler.getGoal({ specific });

    log.add({ goal, method });
    Object.assign(input, { goal, method });

    perf.stop();
    const response = await this.next(input);
    return response;
  };
};


module.exports = {
  parseMethod,
};
