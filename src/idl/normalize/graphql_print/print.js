'use strict';

const { resolve } = require('path');

const { printSchema: graphQLPrintSchema } = require('graphql');

const { renderTemplate } = require('../../../utilities');

const template = resolve(__dirname, './print.mustache');

const printSchema = async function ({ schema }) {
  const printedSchema = graphQLPrintSchema(schema).trim();
  const htmlString = await renderTemplate({
    template,
    data: { printedSchema, prismVersion: '1.6.0' },
  });
  return htmlString;
};

module.exports = {
  printSchema,
};
