'use strict';

const { validateString } = require('./validate');

const parseIp = function ({
  protocolAdapter,
  protocolAdapter: { getIp },
  specific,
}) {
  const ip = getIp({ specific });

  validateString(ip, 'ip', protocolAdapter);

  return { ip };
};

module.exports = {
  parseIp,
};
