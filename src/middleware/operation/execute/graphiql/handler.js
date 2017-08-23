'use strict';

const { renderGraphiQL } = require('./render');

const executeGraphiql = async function ({ queryVars, payload = {}, origin }) {
  const endpointURL = `${origin}/graphql`;
  const { query, variables, operationName } = { ...queryVars, ...payload };

  const content = await renderGraphiQL({
    endpointURL,
    query,
    variables,
    operationName,
  });

  const response = { type: 'html', content };
  return { response };
};

module.exports = {
  executeGraphiql,
};
