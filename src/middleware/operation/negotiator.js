'use strict';

const { addJsl } = require('../../jsl');
const { addReqInfo } = require('../../events');

// Decides which operation to use (e.g. GraphQL) according to route
const operationNegotiator = async function (nextFunc, input) {
  const { route } = input;

  const [operation] = Object.entries(operations)
    .find(([, testFunc]) => testFunc({ route })) || [];

  const inputA = addJsl(input, { $OPERATION: operation });
  const inputB = addReqInfo(inputA, { operation });
  const inputC = { ...inputB, operation };

  const response = await nextFunc(inputC);
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
