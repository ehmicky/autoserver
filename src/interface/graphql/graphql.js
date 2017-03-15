'use strict';


const { runHttpQuery } = require('graphql-server-core');

const idlParse = require('../../idl/parse');


const handleGraphQL = async function graphQLHandler(request) {
  const schema = idlParse.getSchema();
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
      type: 'application/json',
      content: parsedResponse,
    };
  } else if (typeof response === 'string') {
    return {
      type: 'text/html',
      content: response,
    };
  }
};
handleGraphQL.condition = function (request) {
  return request.route === 'GraphQL';
};


module.exports = {
  handleGraphQL,
};