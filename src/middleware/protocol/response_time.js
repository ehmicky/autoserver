'use strict';


const parsing = require('../../parsing');


const setResponseTime = function () {
  return async function setResponseTime(input) {
    const { log, protocol, specific } = input;

    const response = await this.next(input);
    const perf = log.perf.start('protocol.setResponseTime', 'middleware');

    const responseTime = log.perf.all.stop();
    log.add({ responseTime });

    const headers = { 'X-Response-Time': Math.round(responseTime) };
    parsing[protocol].headers.send({ specific, headers });

    perf.stop();
    return response;
  };
};


module.exports = {
  setResponseTime,
};
