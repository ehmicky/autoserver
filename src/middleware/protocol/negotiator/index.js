'use strict';


// Decide which middleware to pick according to request protocol
const protocolNegotiator = function () {
  return async function protocolNegotiator(input) {
    const { jsl } = input;

    const { protocol } = protocols.find(({ test }) => test(input));
    const protocolFullName = protocolFullNames[protocol](input);

    const newJsl = jsl.add({ $PROTOCOL: protocol });

    Object.assign(input, { protocol, protocolFullName, jsl: newJsl });

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

// Includes version as well
const protocolFullNames = {

  http: ({ specific: { req } }) => `HTTP/${req.httpVersion}`,

};


module.exports = {
  protocolNegotiator,
};
