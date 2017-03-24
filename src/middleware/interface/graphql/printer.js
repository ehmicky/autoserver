'use strict';


const { graphqlGetSchema, graphqlPrintSchema } = require('./parse');


const printGraphql = function ({ definitions, bulkWrite, bulkDelete }) {
  const schema = graphqlGetSchema(definitions, { bulkWrite, bulkDelete });
  const printedSchema = graphqlPrintSchema(schema);
  return async function () {
    return {
      type: 'text',
      content: printedSchema,
    };
  };
};


module.exports = {
  printGraphql,
};