'use strict';

// Runtime option `defaultPageSize`
const defaultPageSize = {
  name: 'defaultPageSize',
  default: 100,
  description: 'Default page size',
  group: 'Pagination',
  validate: {
    type: 'integer',
    minimum: 0,
  },
};

// Runtime option `maxPageSize`
const maxPageSize = {
  name: 'maxPageSize',
  default: 100,
  description: 'Maximum pagination size',
  group: 'Pagination',
  validate: {
    type: 'integer',
    minimum: 0,
  },
};

// Runtime option `maxDataLength`
const maxDataLength = {
  name: 'maxDataLength',
  default: 1000,
  description: 'Maximum number of models that can be updated at once',
  group: 'Pagination',
  validate: {
    type: 'integer',
    minimum: 0,
  },
};

module.exports = [
  defaultPageSize,
  maxPageSize,
  maxDataLength,
];
