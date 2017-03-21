'use strict';


// Decides which interface to use (e.g. GraphQL) according to route
const interfaceNegotiator = function ({ route }) {
  if (route === 'graphql') {
    return 'graphql';
  } else if (route === 'graphiql') {
    return 'graphiql';
  }
};


module.exports = {
  interfaceNegotiator,
};