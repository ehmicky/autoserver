'use strict';

const { executeGraphql } = require('./graphql');
const { executeGraphiql } = require('./graphiql');
const { printGraphql } = require('./graphql_print');

// Translates operation-specific calls into generic instance actions
const operationExecute = function (input, nextLayer) {
  const middleware = middlewares[input.operation];
  return middleware(input, nextLayer);
};

const middlewares = {
  GraphQL: executeGraphql,
  GraphiQL: executeGraphiql,
  GraphQLPrint: printGraphql,
};

module.exports = {
  operationExecute,
};
