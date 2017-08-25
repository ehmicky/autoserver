'use strict';

const pageSizeTests = [
  {
    test ({ pageSize }) {
      return pageSize !== undefined && !Number.isInteger(pageSize);
    },
    message: '\'page_size\' must be an integer',
  },

  {
    test ({ pageSize }) {
      return pageSize !== undefined && pageSize < 1;
    },
    message: '\'page_size\' argument must be greater than 0',
  },

  {
    test ({ pageSize, maxPageSize }) {
      return pageSize !== undefined && pageSize > maxPageSize;
    },
    message: ({ maxPageSize }) => `'page_size' argument must be less than ${maxPageSize}`,
  },
];

module.exports = {
  pageSizeTests,
};
