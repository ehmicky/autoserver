'use strict';

const { findIndexes } = require('../indexes');

const update = function ({ collection, newData }) {
  const data = newData
    .map(datum => updateOne({ collection, newData: datum }));
  return { data };
};

const updateOne = function ({ collection, newData, newData: { id } }) {
  const [index] = findIndexes({ collection, filter: { id } });

  // eslint-disable-next-line fp/no-mutating-methods
  collection.splice(index, 1, newData);

  return newData;
};

module.exports = {
  update,
  updateOne,
};
