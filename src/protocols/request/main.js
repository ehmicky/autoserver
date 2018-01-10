'use strict';

const { monitoredReduce } = require('../../perf');

const { validateSpecific } = require('./validate');
const { parseIp } = require('./ip');
const { parseOrigin } = require('./origin');
const { parseQueryvars } = require('./queryvars');
const { parseHeaders } = require('./headers');
const { parseMethod } = require('./method');
const { parsePath } = require('./path');
const { parseInput } = require('./input');
const { handleContentNegotiation } = require('./content_negotiation');
const { parsePayload } = require('./payload');
// eslint-disable-next-line import/max-dependencies
const { protocolNormalization } = require('./normalize');

// Retrieves protocol-specific request information
const parseRequest = function (
  protocolAdapter,
  { specific, config, measures },
) {
  return monitoredReduce({
    funcs: METHODS,
    mapInput: requestInfo =>
      ({ protocolAdapter, specific, config, ...requestInfo }),
    initialInput: { measures },
    mapResponse: (requestInfo, newRequestInfo) =>
      ({ ...requestInfo, ...newRequestInfo }),
    category: 'protoparse',
  });
};

const METHODS = [
  validateSpecific,
  parseIp,
  parseOrigin,
  parseQueryvars,
  parseHeaders,
  parseMethod,
  parsePath,
  parseInput,
  handleContentNegotiation,
  parsePayload,
  protocolNormalization,
];

module.exports = {
  parseRequest,
};
