'use strict';

const { sortBy } = require('../../../../utilities');

// `order_by` sorting
const sortResponse = function ({ data, orderBy }) {
  if (!data || !orderBy) { return data; }

  return sortBy(data, orderBy);
};

module.exports = {
  sortResponse,
};
