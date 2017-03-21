'use strict';


const { InterfaceError } = require('../../error');


// Decides which interface to use (e.g. GraphQL) according to route
const interfaceNegotiator = function ({ route }) {
  const interf = Object.keys(interfaces).find(interfaceName => interfaces[interfaceName]({ route }));
  if (!interf) {
    throw new InterfaceError(`Unsupported interface: ${route}`, { reason: 'UNSUPPORTED_INTERFACE' });
  }
  return interf;
};

const interfaces = {

  graphql: ({ route }) => route === 'graphql',

  graphiql: ({ route }) => route === 'graphiql',

};


module.exports = {
  interfaceNegotiator,
};