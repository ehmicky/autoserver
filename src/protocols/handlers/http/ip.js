'use strict';


const { getClientIp } = require('request-ip');


// Retrieves request IP.
// If unknown, should return undefined.
const getIp = function ({ specific: { req } }) {
  return getClientIp(req);
};


module.exports = {
  getIp,
};
