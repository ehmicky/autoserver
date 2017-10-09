'use strict';

const { printSchema } = require('graphql');

const printGraphQLSchema = function ({ graphQLSchema }) {
  return printSchema(graphQLSchema).trim();
};

module.exports = {
  printGraphQLSchema,
};
