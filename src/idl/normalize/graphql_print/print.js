'use strict';

const { readFile } = require('fs');
const { resolve } = require('path');
const { promisify } = require('util');

const { printSchema: graphQLPrintSchema } = require('graphql');
const { render } = require('mustache');

const PRINT_HTML_FILE = resolve(__dirname, './print.mustache');

const printSchema = async function ({ schema }) {
  const data = {
    printedSchema: graphQLPrintSchema(schema).trim(),
    prismVersion: '1.6.0',
  };
  const htmlFile = await promisify(readFile)(PRINT_HTML_FILE, {
    encoding: 'utf-8',
  });
  const htmlString = render(htmlFile, data);
  return htmlString;
};

module.exports = {
  printSchema,
};
