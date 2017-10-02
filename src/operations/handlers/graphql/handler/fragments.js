'use strict';

// Retrieve GraphQL fragments
const getFragments = function ({ queryDocument: { definitions } }) {
  return definitions.filter(({ kind }) => kind === 'FragmentDefinition');
};

module.exports = {
  getFragments,
};
