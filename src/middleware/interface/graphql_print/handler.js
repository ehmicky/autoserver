'use strict';


const { graphqlGetSchema } = require('../graphql');
const { graphqlPrintSchema } = require('./print');


const printGraphql = async function ({ definitions }) {
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