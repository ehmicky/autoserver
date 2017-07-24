'use strict';

const printGraphql = function (nextFunc, { idl: { GraphQLPrintedSchema } }) {
  return {
    type: 'html',
    content: GraphQLPrintedSchema,
  };
};

module.exports = {
  printGraphql,
};
