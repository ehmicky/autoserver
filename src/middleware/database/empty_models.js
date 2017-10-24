'use strict';

// Remove models that are null|undefined
// Those can happen with some database. E.g. MongoDB sometimes release read
// locks in the middle of a query, which can result in the same model appearing
// twice in the response.
const removeEmptyModels = function ({ response: { data, ...rest } }) {
  const dataA = data.filter(datum => datum != null);
  return { response: { data: dataA, ...rest } };
};

module.exports = {
  removeEmptyModels,
};
