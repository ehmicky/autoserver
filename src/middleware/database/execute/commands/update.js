'use strict';

const { findIndexes } = require('../find');

const update = function ({ collection, newData }) {
  const newModels = newData
    .map(datum => updateOne({ collection, newData: datum }));
  return { data: newModels };
};

const updateOne = function ({ collection, newData }) {
  const { id } = newData;
  const [index] = findIndexes({ collection, filter: { id } });

  const model = collection[index];
  const newModel = { ...model, ...newData };

  // eslint-disable-next-line fp/no-mutating-methods
  collection.splice(index, 1, newModel);

  return newModel;
};

module.exports = {
  update,
  updateOne,
};
