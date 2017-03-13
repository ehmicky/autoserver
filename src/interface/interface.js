'use strict';


const { runHttpQuery } = require('graphql-server-core');
const { renderGraphiQL } = require('graphql-server-module-graphiql');

const idlParse = require('../idl/parse');


const handler = async function (request) {
  if (request.route === 'GraphiQL') {
    return await handleGraphiQL();
  }
  return await handleGraphQL(request);
};

const handleGraphQL = async function (request) {
  const schema = idlParse.getSchema();
  const { query, variables, operationName } = request.params;

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
      method: request[Symbol.for('method')],
    });
  } catch (error) {
    response = error.message;
  }

  let parsedResponse;
  try {
    parsedResponse = JSON.parse(response);
  } catch (error) {
    throw Error('Wrong query');
  }
  return {
    type: 'application/json',
    content: parsedResponse,
  };
};

const handleGraphiQL = async function () {
  const content = renderGraphiQL({
    endpointUrl: 'http://localhost:5001/graphql',
  });
  return {
    type: 'text/html',
    content,
  };
};


module.exports = handler;