'use strict';

const noPageTests = [
  {
    test ({ args: { page } }) {
      return page !== undefined;
    },
    message: '\'page\' must not be defined',
  },
];

module.exports = {
  noPageTests,
};
