'use strict';

const { resolve } = require('path');

const { renderTemplate } = require('../../../../utilities');

const template = resolve(__dirname, './print.mustache');

// Print GraphQL schema as beautified HTML
const handler = async function ({ idl: { graphQLPrintedSchema } }) {
  const content = await renderTemplate({
    template,
    data: { graphQLPrintedSchema, prismVersion: '1.6.0' },
  });

  return { response: { type: 'html', content } };
};

module.exports = {
  handler,
};
