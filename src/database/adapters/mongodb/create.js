'use strict';

const { throwError } = require('../../../error');

const create = function ({ collection, newData }) {
  return { data: newData };
};

module.exports = {
  create,
};
