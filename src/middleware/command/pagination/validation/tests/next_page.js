'use strict';

const nextPageTests = [
  {
    test ({ hasPreviousPage }) {
      if (hasPreviousPage == null) { return true; }

      return typeof hasPreviousPage === 'boolean';
    },
    message: '\'has_previous_page\' must be a boolean',
  },

  {
    test ({ hasNextPage }) {
      if (hasNextPage == null) { return true; }

      return typeof hasNextPage === 'boolean';
    },
    message: '\'has_next_page\' must be a boolean',
  },
];

module.exports = {
  nextPageTests,
};
