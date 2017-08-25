'use strict';

const noPageTests = [
  {
    test ({ page }) {
      return page !== undefined;
    },
    message: '\'page\' must not be defined',
  },
];

module.exports = {
  noPageTests,
};
