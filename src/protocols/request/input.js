'use strict';

const parseInput = function ({
  protocolAdapter: { getInput },
  specific,
  method,
}) {
  return getInput({ specific, method });
};

module.exports = {
  parseInput,
};
