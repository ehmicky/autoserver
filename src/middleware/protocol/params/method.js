'use strict';


const parsing = require('../../../parsing');


// Retrieves protocol methods
const getMethod = function ({ specific, protocol }) {
  const protocolMethod = parsing[protocol].method.getProtocolMethod({
    specific,
  });
  const method = parsing[protocol].method.getMethod({ specific });

  return { protocolMethod, method };
};


module.exports = {
  getMethod,
};
