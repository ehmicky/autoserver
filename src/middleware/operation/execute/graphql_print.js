'use strict';

const printGraphql = function (input) {
  const { idl: { GraphQLPrintedSchema } } = input;
  const response = {
    type: 'html',
    content: GraphQLPrintedSchema,
  };
  return { ...input, response };
};

module.exports = {
  printGraphql,
};
