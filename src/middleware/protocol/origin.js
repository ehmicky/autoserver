'use strict';

// Fill in `mInput.origin`
const parseOrigin = function ({
  protocolAdapter: { getOrigin, getUrl },
  specific,
  config,
}) {
  // Only used to validate URL length
  getUrl({ specific, config });

  const origin = getOrigin({ specific });
  return { origin };
};

module.exports = {
  parseOrigin,
};
