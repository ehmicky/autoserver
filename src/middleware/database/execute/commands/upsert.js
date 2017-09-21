'use strict';

const { findIndex } = require('../find');

const { createOne } = require('./create');
const { updateOne } = require('./update');

const upsert = function ({ collection, newData, opts }) {
  const newModels = newData
    .map(datum => upsertOne({ collection, newData: datum, opts }));
  return { data: newModels };
};

const upsertOne = function ({ collection, newData, opts }) {
  const findIndexOpts = { ...opts, mustExist: null };
  const index = findIndex({ collection, id: newData.id, opts: findIndexOpts });
  const databaseFunc = index === undefined ? createOne : updateOne;
  return databaseFunc({ collection, newData, opts });
};

module.exports = {
  upsert,
};
