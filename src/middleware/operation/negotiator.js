'use strict';

const { addIfv } = require('../../idl_func');
const { addReqInfo } = require('../../events');

// Decides which operation to use (e.g. GraphQL) according to route
const operationNegotiator = function (nextFunc, input) {
  const { route } = input;

  const [operation] = Object.entries(operations)
    .find(([, testFunc]) => testFunc({ route })) || [];

  const inputA = addIfv(input, { $OPERATION: operation });
  const inputB = addReqInfo(inputA, { operation });
  const inputC = { ...inputB, operation };

  return nextFunc(inputC);
};

const operations = {

  GraphQL: ({ route }) => route === 'GraphQL',

  GraphiQL: ({ route }) => route === 'GraphiQL',

  GraphQLPrint: ({ route }) => route === 'GraphQLPrint',

};

module.exports = {
  operationNegotiator,
};
