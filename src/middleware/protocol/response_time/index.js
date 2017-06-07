'use strict';


const setResponseTime = function () {
  return async function setResponseTime(input) {
    const { log } = input;

    const response = await this.next(input);

    log.perf.all.stop();

    return response;
  };
};


module.exports = {
  setResponseTime,
};
