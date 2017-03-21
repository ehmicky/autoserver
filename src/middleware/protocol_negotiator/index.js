'use strict';


const { EngineError } = require('../../error');


// Decide which middleware to pick according to request protocol
// Only protocol supported so far is HTTP
const protocolNegotiator = function ({ req, res }) {
  const protocol = Object.keys(protocols).find(protocolName => protocols[protocolName]({ req, res }));
  if (!protocol) {
    throw new EngineError('Unsupported protocol', { reason: 'UNSUPPORTED_PROTOCOL' });
  }
  return protocol;
};

const protocols = {

  http: ({ req }) => [1, 2].includes(req.httpVersionMajor),

};


module.exports = {
  protocolNegotiator,
};