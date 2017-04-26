'use strict';


const proxyAddr = require('proxy-addr');


const httpGetIp = async function () {
  return async function (input) {
    const { req, info } = input;
    info.ip = proxyAddr(req, () => true);

    const response = await this.next(input);
    return response;
  };
};


module.exports = {
  httpGetIp,
};
