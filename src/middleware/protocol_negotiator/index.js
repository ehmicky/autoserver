'use strict';


const { findKey } = require('lodash');

const { EngineError } = require('../../error');


// Decide which middleware to pick according to request protocol
// Only protocol supported so far is HTTP
const protocolNegotiator = () => function ({ req, res }) {
  const protocol = findKey(protocols, test => test({ req, res }));
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