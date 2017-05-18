'use strict';


const { EngineError } = require('../../error');


// Decide which middleware to pick according to request protocol
const protocolNegotiator = function () {
  return async function protocolNegotiator(input) {
    const { protocol } = input;

    const { name } = protocols.find(({ test }) => test(protocol));
    if (!name) {
      throw new EngineError('Unsupported protocol', {
        reason: 'UNSUPPORTED_PROTOCOL',
      });
    }

    const protocolVersion = protocolVersions[name](protocol);

    Object.assign(protocol, { name, protocolVersion });

    const response = await this.next(input);
    return response;
  };
};

// Only protocol supported so far is HTTP
const protocols = [
  {
    name: 'http',
    test: ({ specific: { req } }) => [1, 2].includes(req.httpVersionMajor),
  },
];

const protocolVersions = {

  http: ({ specific: { req } }) => req.httpVersion,

};


module.exports = {
  protocolNegotiator,
};
