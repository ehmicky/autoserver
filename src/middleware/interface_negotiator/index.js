'use strict';


const { findKey } = require('lodash');

const { EngineError } = require('../../error');


// Decides which interface to use (e.g. GraphQL) according to route
const interfaceNegotiator = () => function ({ route }) {
  const interf = findKey(interfaces, test => test({ route }));
  if (!interf) {
    throw new EngineError(`Unsupported interface: ${route}`, { reason: 'UNSUPPORTED_INTERFACE' });
  }
  return interf;
};

const interfaces = {

  graphql: ({ route }) => route === 'graphql',

  graphiql: ({ route }) => route === 'graphiql',

  graphqlprint: ({ route }) => route === 'graphqlprint',

};


module.exports = {
  interfaceNegotiator,
};