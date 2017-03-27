'use strict';


const { graphqlGetSchema, graphqlPrintSchema } = require('./parse');


const printGraphql = function ({ definitions }) {
  const schema = graphqlGetSchema(definitions);
  return async function () {
    const printedSchema = await graphqlPrintSchema(schema);
    return {
      type: 'html',
      content: printedSchema,
    };
  };
};


module.exports = {
  printGraphql,
};