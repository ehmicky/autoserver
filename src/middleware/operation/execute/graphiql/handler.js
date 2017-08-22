'use strict';

const { renderGraphiQL } = require('./render');

const executeGraphiql = async function (input) {
  const { queryVars, payload = {}, origin } = input;

  const endpointURL = `${origin}/graphql`;
  const { query, variables, operationName } = { ...queryVars, ...payload };

  const content = await renderGraphiQL({
    endpointURL,
    query,
    variables,
    operationName,
  });

  const response = { type: 'html', content };
  return { ...input, response };
};

module.exports = {
  executeGraphiql,
};
