'use strict';

const pageSizeTests = [
  {
    test ({ pageSize }) {
      if (pageSize == null) { return true; }

      return Number.isInteger(pageSize);
    },
    message: '\'page_size\' must be an integer',
  },

  {
    test ({ pageSize }) {
      if (pageSize == null) { return true; }

      return pageSize > 0;
    },
    message: '\'page_size\' argument must be greater than 0',
  },

  {
    test ({ pageSize, maxPageSize }) {
      if (pageSize == null) { return true; }

      return pageSize <= maxPageSize;
    },
    message: ({ maxPageSize }) => `'page_size' argument must be less than or equal to ${maxPageSize}`,
  },
];

module.exports = {
  pageSizeTests,
};
