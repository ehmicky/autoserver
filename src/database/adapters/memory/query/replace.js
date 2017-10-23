'use strict';

// Modifies models
const replace = function ({ collection, newData }) {
  newData.forEach(datum => replaceOne({ collection, newData: datum }));
};

const replaceOne = function ({ collection, newData, newData: { id } }) {
  const index = collection.findIndex(model => model.id === id);

  // eslint-disable-next-line fp/no-mutating-methods
  collection.splice(index, 1, newData);
};

module.exports = {
  replace,
};
