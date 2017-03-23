'use strict';


const { runHttpQuery } = require('graphql-server-core');

const { graphqlGetSchema } = require('./parse');
const { EngineError } = require('../../../error');


const executeGraphql = function ({ definitions, bulkWrite, bulkDelete }) {
  const schema = graphqlGetSchema({ definitions, bulkOptions: { write: bulkWrite, delete: bulkDelete } });
  return async function (request) {
    // Parameters can be in either query variables or payload (including by using application/graphql)
    const { query, variables, operationName } = Object.assign({}, request.params, request.payload);
    const { operation: method } = request;

    if (!query) {
      throw new EngineError('Missing GraphQL query', { reason: 'GRAPHQL_NO_QUERY' });
    }

    let response;
    try {
      response = await runHttpQuery([], {
        options: {
          schema: schema,
          context: {
            callback: fireNext.bind(this),
          },
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
};

const fireNext = async function ({ operation, args }) {
  const response = await this.next({ operation, args });
  return response;
};


module.exports = {
  executeGraphql,
};