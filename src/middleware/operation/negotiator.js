'use strict';

// Decides which operation to use (e.g. GraphQL) according to route
const operationNegotiator = async function (input) {
  const { route, jsl, log } = input;

  const [operation] = Object.entries(operations)
    .find(([, testFunc]) => testFunc({ route })) || [];

  const nextInput = jsl.addToInput(input, { $OPERATION: operation });
  log.add({ operation });
  Object.assign(nextInput, { operation });

  const response = await this.next(nextInput);
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
