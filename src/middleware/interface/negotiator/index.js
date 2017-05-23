'use strict';


const { findKey } = require('lodash');


// Decides which interface to use (e.g. GraphQL) according to route
const interfaceNegotiator = function () {
  return async function interfaceNegotiator(input) {
    const { route } = input;
    const interf = findKey(interfaces, test => test({ route }));
    Object.assign(input, { interface: interf });

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
