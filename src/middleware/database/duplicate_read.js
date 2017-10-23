'use strict';

// Remove duplicate read models
// Those can happen with some database. E.g. MongoDB sometimes release read
// locks in the middle of a query, which can result in the same model appearing
// twice in the response.
const duplicateReads = function ({ response: { data, ...rest } }) {
  const dataA = data.filter(isDuplicateRead);
  return { response: { data: dataA, ...rest } };
};

const isDuplicateRead = function ({ id }, index, data) {
  return data
    .slice(index + 1)
    .every(({ id: idA }) => idA !== id);
};

module.exports = {
  duplicateReads,
};
