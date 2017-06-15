'use strict';


const { getClientIp } = require('request-ip');


const getIp = function ({ specific: { req } }) {
  return getClientIp(req);
};


module.exports = {
  getIp,
};
