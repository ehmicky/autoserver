'use strict';

const { uniq } = require('../../utilities');

// Remove duplicate read models
// Those can happen with some database. E.g. MongoDB sometimes release read
// locks in the middle of a query, which can result in the same model appearing
// twice in the response.
const duplicateReads = function ({ response: { data, ...rest } }) {
  const dataA = uniq(data, ({ id }) => id);
  return { response: { data: dataA, ...rest } };
};

module.exports = {
  duplicateReads,
};
