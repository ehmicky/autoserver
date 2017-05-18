'use strict';


const { findKey } = require('lodash');

const { EngineError } = require('../../error');


// Decides which interface to use (e.g. GraphQL) according to route
const interfaceNegotiator = function () {
  return async function interfaceNegotiator(input) {
    const { info, interf: { route } } = input;
    const interf = findKey(interfaces, test => test({ route }));
    if (!interf) {
      const message = `Unsupported interface: ${route}`;
      throw new EngineError(message, { reason: 'UNSUPPORTED_INTERFACE' });
    }
    info.interface = interf;

    const response = await this.next(input);
    return response;
  };
};

const interfaces = {

  graphql: ({ route }) => route === 'graphql',

  graphiql: ({ route }) => route === 'graphiql',

  graphqlprint: ({ route }) => route === 'graphqlprint',

};


module.exports = {
  interfaceNegotiator,
};
