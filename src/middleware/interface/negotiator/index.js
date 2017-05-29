'use strict';


const { findKey } = require('lodash');


// Decides which interface to use (e.g. GraphQL) according to route
const interfaceNegotiator = function () {
  return async function interfaceNegotiator(input) {
    const { route, jsl } = input;

    const interf = findKey(interfaces, test => test({ route }));

    const newJsl = jsl.add({ $INTERFACE: interf });

    Object.assign(input, { interface: interf, jsl: newJsl });

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
