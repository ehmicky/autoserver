'use strict';


const { getClientIp } = require('request-ip');


const httpGetIp = function () {
  return async function httpGetIp(input) {
    const { req, info } = input;
    info.ip = getClientIp(req) || '';

    const response = await this.next(input);
    return response;
  };
};


module.exports = {
  httpGetIp,
};
