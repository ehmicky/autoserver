'use strict';

const pageTests = [
  {
    test ({ args: { page } }) {
      return page !== undefined && !Number.isInteger(page);
    },
    message: '\'page\' must be an integer',
  },

  {
    test ({ args: { page } }) {
      return page !== undefined && page < 1;
    },
    message: '\'page\' must be greater than 0',
  },
];

module.exports = {
  pageTests,
};
