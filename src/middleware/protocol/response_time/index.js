'use strict';


const setResponseTime = function () {
  return async function setResponseTime(input) {
    const { log } = input;

    const response = await this.next(input);

    const responseTime = log.perf.all.stop();
    log.add({ responseTime });

    return response;
  };
};


module.exports = {
  setResponseTime,
};
