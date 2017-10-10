'use strict';

const replace = function ({ collection, newData }) {
  const data = newData
    .map(datum => replaceOne({ collection, newData: datum }));
  return { data };
};

const replaceOne = function ({ collection, newData, newData: { id } }) {
  const index = collection.findIndex(model => model.id === id);

  // eslint-disable-next-line fp/no-mutating-methods
  collection.splice(index, 1, newData);

  return newData;
};

module.exports = {
  replace,
  replaceOne,
};
