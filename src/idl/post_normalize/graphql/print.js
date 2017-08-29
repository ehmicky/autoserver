'use strict';

const { printSchema: graphQLPrintSchema } = require('graphql');

const printSchema = function ({ GraphQLSchema }) {
  return graphQLPrintSchema(GraphQLSchema).trim();
};

module.exports = {
  printSchema,
};
