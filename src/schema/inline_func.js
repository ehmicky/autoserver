'use strict';

const { getAll } = require('../utilities');
const { isInlineFunc } = require('../functions');

// Retrieve paths of every value in the schema that uses inline functions
const addInlineFuncPaths = function ({ schema }) {
  const inlineFuncPaths = getAll(schema)
    .filter(([inlineFunc]) => isInlineFunc({ inlineFunc }))
    .map(([, key]) => key);
  return { ...schema, inlineFuncPaths };
};

module.exports = {
  addInlineFuncPaths,
};
