'use strict';


const { runHttpQuery } = require('graphql-server-core');

const { graphqlGetSchema } = require('../../idl');
const { GraphqlInterfaceError } = require('../../error/types');


const executeGraphql = async function (request) {
  const schema = graphqlGetSchema();
  // Parameters can be in either query variables or payload (including by using application/graphql)
  const query = request.params.query || request.payload.query;
  const variables = request.params.variables || request.payload.variables;
  const operationName = request.params.operationName || request.payload.operationName;
  const { operation: method } = request;

  if (!query) {
    throw new GraphqlInterfaceError('Missing GraphQL query', { reason: 'GRAPHQL_NO_QUERY' });
  }

  let response;
  try {
    response = await runHttpQuery([], {
      options: {
        schema: schema,
        context: {},
        rootValue: {},
      },
      query: {
        query,
        variables,
        operationName,
      },
      method,
    });
  } catch (error) {
    response = error.message;
  }

  let parsedResponse;
  if (typeof response === 'object') {
    try {
      parsedResponse = JSON.parse(response);
    } catch (error) {
      throw Error('Wrong query');
    }
    return {
      type: 'object',
      content: parsedResponse,
    };
  } else if (typeof response === 'string') {
    return {
      type: 'html',
      content: response,
    };
  }
};


module.exports = {
  executeGraphql,
};