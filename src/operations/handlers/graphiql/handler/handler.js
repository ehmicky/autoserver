'use strict';

const { renderGraphiql } = require('./render');

// Render GraphiQL HTML file, i.e. GraphQL debugger
const handler = async function ({ queryVars, payload = {}, origin }) {
  const endpointURL = `${origin}/graphql`;
  const { query, variables, operationName } = { ...queryVars, ...payload };

  const content = await renderGraphiql({
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
