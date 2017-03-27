'use strict';


const { graphqlGetSchema, graphqlPrintSchema } = require('./parse');


const printGraphql = function ({ definitions }) {
  const schema = graphqlGetSchema(definitions);
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