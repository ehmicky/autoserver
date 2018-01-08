'use strict';

// Retrieve request's IP, assigned to protocol mInput,
// and also to parameter `ip`
const getIp = function ({ protocolAdapter, specific }) {
  const ip = protocolAdapter.getIp({ specific });
  return { ip };
};

module.exports = {
  getIp,
};
