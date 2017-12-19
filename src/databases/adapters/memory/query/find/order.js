'use strict';

const { sortBy } = require('../../../../../utilities');

// `order` sorting
const sortResponse = function ({ data, order }) {
  if (!order) { return data; }

  return sortBy(data, order);
};

module.exports = {
  sortResponse,
};
