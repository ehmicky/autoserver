'use strict';

const { searchIndexes } = require('../indexes');

const { createOne } = require('./create');
const { updateOne } = require('./update');

const upsert = function ({ collection, newData }) {
  const data = newData
    .map(datum => upsertOne({ collection, newData: datum }));
  return { data };
};

const upsertOne = function ({ collection, newData }) {
  const { id } = newData;
  const indexes = searchIndexes({ collection, filter: { id } });
  const databaseFunc = indexes.length === 0 ? createOne : updateOne;
  return databaseFunc({ collection, newData });
};

module.exports = {
  upsert,
};
