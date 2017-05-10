'use strict';


const { log } = require('../../../utilities');


const httpLogger = async function () {
  return async function httpLogger(input) {
    logRequest(input);

    const response = await this.next(input);
    return response;
  };
};

const logRequest = function ({ req: { httpVersion, method, url, headers }, info: { ip } }) {
  log.log(`HTTP/${httpVersion} ${method} ${url} ${ip} ${JSON.stringify(headers)}`);
};


module.exports = {
  httpLogger,
};
