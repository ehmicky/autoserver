'use strict';

// Retrieves protocol request's input
// TODO: remove specific
const parseProtocol = function (
  { protocolAdapter: { parseRequest }, config },
  nextLayer,
  { measures },
) {
  return parseRequest({ config, measures });
};

module.exports = {
  parseProtocol,
};
