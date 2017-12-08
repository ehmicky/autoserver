'use strict';

const opts = [
  {
    name: 'data',
    validate: {
      type: 'object',
    },
  },

  {
    name: 'save',
    default: true,
    validate: {
      type: 'boolean',
    },
  },
];

module.exports = {
  opts,
};
