'use strict';

const { addJsl } = require('../../jsl');
const { addLogInfo } = require('../../logging');

// Decides which operation to use (e.g. GraphQL) according to route
const operationNegotiator = async function (nextFunc, input) {
  const { route } = input;

  const [operation] = Object.entries(operations)
    .find(([, testFunc]) => testFunc({ route })) || [];

  const inputA = addJsl(input, { $OPERATION: operation });
  const inputB = addLogInfo(inputA, { operation });
  const inputC = Object.assign({}, inputB, { operation });

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
