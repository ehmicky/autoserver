'use strict';

const nextPageTests = [
  {
    test ({ hasPreviousPage }) {
      return typeof hasPreviousPage !== 'boolean' &&
        hasPreviousPage !== undefined;
    },
    message: '\'has_previous_page\' must be a boolean',
  },

  {
    test ({ hasNextPage }) {
      return typeof hasNextPage !== 'boolean' &&
        hasNextPage !== undefined;
    },
    message: '\'has_next_page\' must be a boolean',
  },
];

module.exports = {
  nextPageTests,
};
