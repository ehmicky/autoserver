'use strict';


const { findKey } = require('lodash');

const { EngineError } = require('../../error');


// Decide which middleware to pick according to request protocol
// Only protocol supported so far is HTTP
const protocolNegotiator = async function () {
  return await function (input) {
    const { info, req, res } = input;
    const protocol = findKey(protocols, test => test({ req, res }));
    if (!protocol) {
      throw new EngineError('Unsupported protocol', { reason: 'UNSUPPORTED_PROTOCOL' });
    }
    info.protocol = protocol;

    const response = this.next(input);
    return response;
  };
};
const protocolNegotiation = async () => ({ info: { protocol } }) => protocol;

const protocols = {

  http: ({ req }) => [1, 2].includes(req.httpVersionMajor),

};


module.exports = {
  protocolNegotiator,
  protocolNegotiation,
};
