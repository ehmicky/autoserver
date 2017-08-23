'use strict';

// Decides which operation to use (e.g. GraphQL) according to route
const operationNegotiator = function ({ route }) {
  const [operation] = Object.entries(operations)
    .find(([, testFunc]) => testFunc({ route })) || [];

  return {
    operation,
    ifvParams: { $OPERATION: operation },
  };
};

const operations = {

  GraphQL: ({ route }) => route === 'GraphQL',

  GraphiQL: ({ route }) => route === 'GraphiQL',

  GraphQLPrint: ({ route }) => route === 'GraphQLPrint',

};

module.exports = {
  operationNegotiator,
};
