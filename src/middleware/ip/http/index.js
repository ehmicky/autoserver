'use strict';


const { getClientIp } = require('request-ip');


const httpGetIp = function () {
  return async function httpGetIp(input) {
    const { protocol } = input;
    const { specific: { req } } = protocol;

    protocol.ip = getClientIp(req) || '';

    const response = await this.next(input);
    return response;
  };
};


module.exports = {
  httpGetIp,
};
