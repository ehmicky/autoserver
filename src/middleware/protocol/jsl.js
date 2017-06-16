'use strict';


const { Jsl } = require('../../jsl');


// Sets up JSL helper
const setJsl = function ({ idl: { helpers, exposeMap } }) {
  return async function setJsl(input) {
    const { log, protocol } = input;
    const perf = log.perf.start('protocol.setJsl', 'middleware');

    const jsl = new Jsl({ exposeMap });
    const jslWithHelpers = jsl.addHelpers({ helpers });
    const newJsl = jslWithHelpers.add({ $PROTOCOL: protocol });

    Object.assign(input, { jsl: newJsl });

    perf.stop();
    const response = await this.next(input);
    return response;
  };
};


module.exports = {
  setJsl,
};
