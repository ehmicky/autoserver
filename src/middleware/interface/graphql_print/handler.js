'use strict';


const { getSchema } = require('../graphql');
const { printSchema } = require('./print');


const printGraphql = async function ({ idl }) {
  const schema = getSchema({ idl });
  const content = await printSchema(schema);

  return async function () {
    return {
      type: 'html',
      content,
    };
  };
};


module.exports = {
  printGraphql,
};
