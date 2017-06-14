'use strict';


const { getSchema } = require('../graphql_schema');
const { printSchema } = require('./print');


const printGraphql = async function ({ idl, serverOpts }) {
  const schema = getSchema({ idl, serverOpts });
  const content = await printSchema(schema);

  return function printGraphql() {
    return {
      type: 'html',
      content,
    };
  };
};


module.exports = {
  printGraphql,
};
