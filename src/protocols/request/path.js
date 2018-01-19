'use strict';

const { validateString } = require('./validate');

const parsePath = function ({
  protocolAdapter,
  protocolAdapter: { getPath },
  specific,
}) {
  if (getPath === undefined) { return; }

  const path = getPath({ specific });

  validateString(path, 'path', protocolAdapter);

  return { path };
};

module.exports = {
  parsePath,
};
