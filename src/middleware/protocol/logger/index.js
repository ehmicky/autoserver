'use strict';


const { log } = require('../../../utilities');


const logger = function () {
  return async function httpLogger(input) {
    logRequest(input);

    const response = await this.next(input);
    return response;
  };
};

const logRequest = function ({
  timestamp,
  protocolFullName,
  protocolMethod,
  method,
  path,
  route,
  ip,
  params,
  protocolArgs,
}) {
  params = JSON.stringify(params);
  protocolArgs = JSON.stringify(protocolArgs);
  const message = [
    timestamp,
    protocolFullName,
    protocolMethod,
    method,
    path,
    route,
    ip,
    params,
    protocolArgs,
  ].join(' ');
  log.log(message);
};


module.exports = {
  logger,
};
