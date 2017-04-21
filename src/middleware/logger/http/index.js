'use strict';


const { log } = require('../../../utilities');


const httpLogger = async function () {
  return async function (input) {
    logRequest(input);

    const response = await this.next(input);
    return response;
  };
};

const logRequest = function ({ req: { httpVersion, url, headers, method }, route }) {
  log.log(`HTTP/${httpVersion} ${method} ${url} ${route} ${JSON.stringify(headers)}`);
};


module.exports = {
  httpLogger,
};
