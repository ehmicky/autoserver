'use strict';

const { throwError } = require('../../../../error');

// Retrieve GraphQL fragments
const getFragments = function ({ queryDocument: { definitions } }) {
  const fragments = definitions
    .filter(({ kind }) => kind === 'FragmentDefinition');

  validateFragments({ fragments });

  return fragments;
};

const validateFragments = function ({ fragments }) {
  fragments.forEach(validateFragment);
};

const validateFragment = function (fragment, index, fragments) {
  const fragmentName = fragment.name && fragment.name.value;
  const hasDuplicate = fragments
    .map(({ name }) => name && name.value)
    .slice(index + 1)
    .includes(fragmentName);

  // GraphQL spec 5.4.1.1 'Fragment Name Uniqueness'
  if (hasDuplicate) {
    const message = `Two fragments are named '${fragmentName}'`;
    throwError(message, { reason: 'SYNTAX_VALIDATION' });
  }
};

module.exports = {
  getFragments,
};
