'use strict';

const { resolve } = require('path');

const { renderTemplate } = require('../../../../utilities');

const template = resolve(__dirname, './print.mustache');

// Print GraphQL schema as beautified HTML
const handler = async function ({ idl: { GraphQLPrintedSchema } }) {
  const content = await renderTemplate({
    template,
    data: { printedSchema: GraphQLPrintedSchema, prismVersion: '1.6.0' },
  });

  return { response: { type: 'html', content } };
};

module.exports = {
  handler,
};
