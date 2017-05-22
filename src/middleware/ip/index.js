'use strict';


const { mapAsync } = require('../../utilities');
const { httpGetIp } = require('./http');


// Retrieve request's IP, assigned to protocol input, and also to JSL $NOW
const getIp = async function (opts) {
  const map = await mapAsync(ipMap, async func => await func(opts));

  return async function getIp(input) {
    const { protocol, jsl } = input;

    const ip = map[protocol.name](input) || '';
    protocol.ip = ip;
    jsl.add({ $IP: ip });

    const response = await this.next(input);
    return response;
  };
};

const ipMap = {
  http: httpGetIp,
};


module.exports = {
  getIp,
};
