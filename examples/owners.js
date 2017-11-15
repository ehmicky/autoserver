'use strict';

const owners = {
  description: 'A pet\'s owner',
  attributes: {
    name: {},
    pets: {
      type: 'pets[]',
    },
  },
};

module.exports = owners;
