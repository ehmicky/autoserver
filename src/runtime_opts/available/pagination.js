'use strict';

// Runtime option `defaultPageSize`
const defaultPageSize = {
  name: 'defaultPageSize',
  validate: {
    type: 'integer',
    minimum: 0,
  },
};

// Runtime option `maxPageSize`
const maxPageSize = {
  name: 'maxPageSize',
  validate: {
    type: 'integer',
    minimum: 0,
  },
};

// Runtime option `maxDataLength`
const maxDataLength = {
  name: 'maxDataLength',
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
