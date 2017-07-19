'use strict';

const { executeGraphql } = require('./graphql');
const { executeGraphiql } = require('./graphiql');
const { printGraphql } = require('./graphql_print');

// Translates operation-specific calls into generic instance actions
const operationExecute = async function (input) {
  const middleware = getMiddleware(input);
  const response = await middleware.call(this, input);
  return response;
};

const getMiddleware = function ({ operation }) {
  return middlewares[operation];
};

Object.assign(operationExecute, { getMiddleware });

const middlewares = {
  GraphQL: executeGraphql,
  GraphiQL: executeGraphiql,
  GraphQLPrint: printGraphql,
};

module.exports = {
  operationExecute,
};
