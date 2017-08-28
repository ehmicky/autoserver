'use strict';

const pageTests = [
  {
    test ({ page }) {
      if (page == null) { return true; }

      return Number.isInteger(page);
    },
    message: '\'page\' must be an integer',
  },

  {
    test ({ page }) {
      if (page == null) { return true; }

      return page > 0;
    },
    message: '\'page\' must be greater than 0',
  },
];

module.exports = {
  pageTests,
};
