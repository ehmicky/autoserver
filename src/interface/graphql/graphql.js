'use strict';


const { runHttpQuery } = require('graphql-server-core');

const { graphqlGetSchema } = require('../../idl');


const executeGraphql = async function (request) {
  const schema = graphqlGetSchema();
  const { query, variables, operationName } = request.params;
  const { method } = request;

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