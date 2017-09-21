'use strict';

const { findIndexes } = require('../find');

const { createOne } = require('./create');
const { updateOne } = require('./update');

const upsert = function ({ collection, newData }) {
  const newModels = newData
    .map(datum => upsertOne({ collection, newData: datum }));
  return { data: newModels };
};

const upsertOne = function ({ collection, newData }) {
  const { id } = newData;
  const indexes = findIndexes({ collection, filter: { id }, idCheck: false });
  const databaseFunc = indexes.length === 0 ? createOne : updateOne;
  return databaseFunc({ collection, newData });
};

module.exports = {
  upsert,
};
