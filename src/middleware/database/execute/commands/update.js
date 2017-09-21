'use strict';

const { findIndex } = require('../find');

const update = function ({ collection, newData, opts }) {
  const newModels = newData
    .map(datum => updateOne({ collection, newData: datum, opts }));
  return { data: newModels };
};

const updateOne = function ({ collection, newData, opts }) {
  const index = findIndex({ collection, id: newData.id, opts });

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
