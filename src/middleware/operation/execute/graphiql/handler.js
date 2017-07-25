'use strict';

const { renderGraphiQL } = require('./render');

const executeGraphiql = async function (nextFunc, input) {
  const { queryVars, payload = {}, origin } = input;

  const endpointURL = `${origin}/graphql`;
  const {
    query,
    variables,
    operationName,
  } = Object.assign({}, queryVars, payload);

  const content = await renderGraphiQL({
    endpointURL,
    query,
    variables,
    operationName,
  });

  return {
    type: 'html',
    content,
  };
};

module.exports = {
  executeGraphiql,
};
