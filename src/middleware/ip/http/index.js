'use strict';


const { getClientIp } = require('request-ip');


const httpGetIp = function () {
  return function ({ specific: { req } }) {
    return getClientIp(req);
  };
};


module.exports = {
  httpGetIp,
};
