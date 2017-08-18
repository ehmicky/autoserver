'use strict';

// Runtime option `defaultPageSize`
const defaultPageSize = {
  name: 'defaultPageSize',
  default: 100,
  validate: {
    type: 'integer',
    minimum: 0,
  },
};

// Runtime option `maxPageSize`
const maxPageSize = {
  name: 'maxPageSize',
  default: 100,
  validate: {
    type: 'integer',
    minimum: 0,
  },
};

// Runtime option `maxDataLength`
const maxDataLength = {
  name: 'maxDataLength',
  default: 1000,
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
