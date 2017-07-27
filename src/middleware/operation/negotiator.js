'use strict';

const { addJsl } = require('../../jsl');
const { addLogInfo } = require('../../logging');

// Decides which operation to use (e.g. GraphQL) according to route
const operationNegotiator = async function (nextFunc, input) {
  const { route, jsl } = input;

  const [operation] = Object.entries(operations)
    .find(([, testFunc]) => testFunc({ route })) || [];

  const newInput = addJsl({ input, jsl, params: { $OPERATION: operation } });
  const loggedInput = addLogInfo(newInput, { operation });
  const nextInput = Object.assign({}, loggedInput, { operation });

  const response = await nextFunc(nextInput);
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
