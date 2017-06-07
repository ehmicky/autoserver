'use strict';


const parsing = require('../../../parsing');


// Retrieve request path, so it can be used e.g. by routing middleware and
// logger
const getPath = function () {
  return async function getPath(input) {
    const { protocol, log, specific } = input;
    const perf = log.perf.start('getPath', 'middleware');

    const url = parsing[protocol].url.getUrl({ specific });
    const path = parsing[protocol].url.getPath({ specific });

    log.add({ url, path });
    Object.assign(input, { url, path });

    perf.stop();
    const response = await this.next(input);
    return response;
  };
};


module.exports = {
  getPath,
};
