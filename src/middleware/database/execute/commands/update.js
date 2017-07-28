'use strict';

const { findIndex } = require('../find');

const update = function ({ collection, newData, opts, opts: { dryRun } }) {
  const index = findIndex({ collection, id: newData.id, opts });

  const model = collection[index];
  const newModel = { ...model, ...newData };

  if (!dryRun) {
    collection.splice(index, 1, newModel);
  }

  return newModel;
};

const updateOne = function ({ collection, newData, opts }) {
  const newModel = update({ collection, newData, opts });
  return { data: newModel };
};

const updateMany = function ({ collection, newData, opts }) {
  const newModels = newData.map(datum =>
    update({ collection, newData: datum, opts })
  );
  return { data: newModels };
};

module.exports = {
  update,
  updateOne,
  updateMany,
};
