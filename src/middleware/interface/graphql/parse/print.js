'use strict';


const { printSchema: graphQLPrintSchema, } = require('graphql');


const printSchema = function (schema) {
  return graphQLPrintSchema(schema);
};


module.exports = {
  graphqlPrintSchema: printSchema,
};