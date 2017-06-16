'use strict';


const { printSchema } = require('./print');


const printGraphql = function () {
  return async function printGraphql({ idl: { GraphQLSchema: schema } }) {
    const content = await printSchema({ schema });
    return {
      type: 'html',
      content,
    };
  };
};


module.exports = {
  printGraphql,
};
