'use strict';


const { EngineError } = require('../../error');


// Decide which middleware to pick according to request protocol
const protocolNegotiator = function () {
  return async function protocolNegotiator(input) {
    const { protocol } = protocols.find(({ test }) => test(input));
    if (!protocol) {
      const message = 'Unsupported protocol';
      throw new EngineError(message, { reason: 'UNSUPPORTED_PROTOCOL' });
    }

    const protocolFullName = protocolVersions[protocol](input);

    Object.assign(input, { protocol, protocolFullName });

    const response = await this.next(input);
    return response;
  };
};

// Only protocol supported so far is HTTP
const protocols = [
  {
    protocol: 'http',
    test: ({ specific: { req } }) => [1, 2].includes(req.httpVersionMajor),
  },
];

const protocolVersions = {

  http: ({ specific: { req } }) => `HTTP/${req.httpVersion}`,

};


module.exports = {
  protocolNegotiator,
};
