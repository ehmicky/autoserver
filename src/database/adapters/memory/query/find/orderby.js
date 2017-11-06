'use strict';

const { sortBy } = require('../../../../../utilities');

// `orderby` sorting
const sortResponse = function ({ data, orderby }) {
  if (!orderby) { return data; }

  return sortBy(data, orderby);
};

module.exports = {
  sortResponse,
};
