'use strict';

const printGraphql = function ({ idl: { GraphQLPrintedSchema } }) {
  return {
    type: 'html',
    content: GraphQLPrintedSchema,
  };
};

module.exports = {
  printGraphql,
};
