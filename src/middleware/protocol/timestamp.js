'use strict';


const getTimestamp = function () {
  return async function getTimestamp(input) {
    const { jsl, log } = input;
    const perf = log.perf.start('protocol.getTimestamp', 'middleware');

    const timestamp = (new Date()).toISOString();
    const newJsl = jsl.add({ $NOW: timestamp });
    log.add({ timestamp });

    Object.assign(input, { timestamp, jsl: newJsl });

    perf.stop();
    const response = await this.next(input);
    return response;
  };
};


module.exports = {
  getTimestamp,
};
