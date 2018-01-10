'use strict';

const { renderGraphiql } = require('./render');

// Render GraphiQL HTML file, i.e. GraphQL debugger
const parse = async function ({ queryvars, payload = {}, origin }) {
  const endpointURL = `${origin}/graphql`;
  const { query, variables, operationName } = { ...queryvars, ...payload };

  const content = await renderGraphiql({
    endpointURL,
    query,
    variables,
    operationName,
  });

  return { response: { type: 'html', content } };
};

module.exports = {
  parse,
};
