'use strict';

// Decides which operation to use (e.g. GraphQL) according to route
const operationNegotiator = async function (input) {
  const { route, jsl, log } = input;

  const [operation] = Object.entries(operations)
    .find(([, testFunc]) => testFunc({ route })) || [];

  const newJsl = jsl.add({ $OPERATION: operation });

  log.add({ operation });
  Object.assign(input, { operation, jsl: newJsl });

  const response = await this.next(input);
  return response;
};

const operations = {

  GraphQL: ({ route }) => route === 'GraphQL',

  GraphiQL: ({ route }) => route === 'GraphiQL',

  GraphQLPrint: ({ route }) => route === 'GraphQLPrint',

};

module.exports = {
  operationNegotiator,
};
