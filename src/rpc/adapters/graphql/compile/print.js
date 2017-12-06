'use strict';

const { printSchema } = require('graphql');

const printGraphqlSchema = function ({ graphqlSchema }) {
  return printSchema(graphqlSchema).trim();
};

module.exports = {
  printGraphqlSchema,
};
