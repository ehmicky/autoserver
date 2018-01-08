'use strict';

// Fill in `mInput.method`, protocol method, e.g. 'POST'
// Meant to be used by rpc layer.
const parseMethod = function ({ specific, protocolAdapter: { getMethod } }) {
  if (getMethod === undefined) { return; }

  const method = getMethod({ specific });
  return { method };
};

module.exports = {
  parseMethod,
};
