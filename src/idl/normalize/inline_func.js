'use strict';

const { getAll } = require('../../utilities');
const { isInlineFunc } = require('../../idl_func');

// Retrieve paths of every value in IDL that uses inline functions
const addInlineFuncPaths = function ({ idl }) {
  const inlineFuncPaths = getAll(idl)
    .filter(([inlineFunc]) => isInlineFunc({ inlineFunc }))
    .map(([, key]) => key);
  return { ...idl, inlineFuncPaths };
};

module.exports = {
  addInlineFuncPaths,
};
