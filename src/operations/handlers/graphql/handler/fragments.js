'use strict';

const { validateDuplicates } = require('./duplicates');

// Retrieve GraphQL fragments
const getFragments = function ({ queryDocument: { definitions } }) {
  const fragments = definitions
    .filter(({ kind }) => kind === 'FragmentDefinition');

  // GraphQL spec 5.4.1.1 'Fragment Name Uniqueness'
  validateDuplicates({ nodes: fragments, type: 'fragments' });

  return fragments;
};

module.exports = {
  getFragments,
};
