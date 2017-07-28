'use strict';

const { executeGraphql } = require('./graphql');
const { executeGraphiql } = require('./graphiql');
const { printGraphql } = require('./graphql_print');

// Translates operation-specific calls into generic instance actions
const operationExecute = async function (nextFunc, input) {
  const middleware = middlewares[input.operation];
  const response = await middleware(nextFunc, input);
  return response;
};

const middlewares = {
  GraphQL: executeGraphql,
  GraphiQL: executeGraphiql,
  GraphQLPrint: printGraphql,
};

module.exports = {
  operationExecute,
};
