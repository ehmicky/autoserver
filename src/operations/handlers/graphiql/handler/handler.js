'use strict';

const { renderGraphiQL } = require('./render');

// Render GraphiQL HTML file, i.e. GraphQL debugger
const handler = async function ({ queryVars, payload = {}, origin }) {
  const endpointURL = `${origin}/graphql`;
  const { query, variables, operationName } = { ...queryVars, ...payload };

  const content = await renderGraphiQL({
    endpointURL,
    query,
    variables,
    operationName,
  });

  return { response: { type: 'html', content } };
};

module.exports = {
  handler,
};
