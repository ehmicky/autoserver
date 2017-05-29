'use strict';


const { mapAsync } = require('../../../utilities');
const { httpGetIp } = require('./http');


// Retrieve request's IP, assigned to protocol input, and also to JSL $IP
const getIp = async function (opts) {
  const map = await mapAsync(ipMap, async func => await func(opts));

  return async function getIp(input) {
    const { jsl, protocol } = input;

    const ip = map[protocol](input) || '';
    const newJsl = jsl.add({ $IP: ip });
    Object.assign(input, { ip, jsl: newJsl });

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
