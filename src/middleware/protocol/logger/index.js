'use strict';


const { log } = require('../../../utilities');


const logger = function () {
  return async function httpLogger(input) {
    logRequest(input);

    const response = await this.next(input);
    return response;
  };
};

const logRequest = function ({ protocolFullName, method, path, ip, params }) {
  params = JSON.stringify(params);
  const message = [protocolFullName, method, path, ip, params].join(' ');
  log.log(message);
};


module.exports = {
  logger,
};
