'use strict';


const { findKey } = require('lodash');

const { EngineError } = require('../../error');


// Decide which middleware to pick according to request protocol
// Only protocol supported so far is HTTP
const protocolNegotiator = function () {
  return async function protocolNegotiator(input) {
    const { info, req, res } = input;
    const protocol = findKey(protocols, test => test({ req, res }));
    if (!protocol) {
      throw new EngineError('Unsupported protocol', { reason: 'UNSUPPORTED_PROTOCOL' });
    }
    info.protocol = protocol;

    const protocolVersion = protocolVersions[protocol]({ req, res });
    info.protocolVersion = protocolVersion;

    const response = await this.next(input);
    return response;
  };
};
const protocolNegotiation = () => ({ info: { protocol } }) => protocol;

const protocols = {

  http: ({ req }) => [1, 2].includes(req.httpVersionMajor),

};

const protocolVersions = {

  http: ({ req }) => req.httpVersion,

};


module.exports = {
  protocolNegotiator,
  protocolNegotiation,
};
