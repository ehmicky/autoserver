'use strict';

const noPageTests = [
  {
    test ({ page }) {
      return page == null;
    },
    message: '\'page\' must not be defined',
  },
];

module.exports = {
  noPageTests,
};
