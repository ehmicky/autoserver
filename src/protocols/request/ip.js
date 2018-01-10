'use strict';

const { validateString } = require('./validate');

const parseIp = function ({ protocolAdapter: { getIp }, specific }) {
  const ip = getIp({ specific });

  validateString(ip, 'ip');

  return { ip };
};

module.exports = {
  parseIp,
};
