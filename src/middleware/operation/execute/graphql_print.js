'use strict';

const printGraphql = function ({ idl: { GraphQLPrintedSchema } }) {
  const response = {
    type: 'html',
    content: GraphQLPrintedSchema,
  };
  return { response };
};

module.exports = {
  printGraphql,
};
