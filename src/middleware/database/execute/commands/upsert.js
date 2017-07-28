'use strict';

const { findIndex } = require('../find');

const { create } = require('./create');
const { update } = require('./update');

const upsert = function ({ collection, newData, opts }) {
  const findIndexOpts = { ...opts, mustExist: null };
  const index = findIndex({ collection, id: newData.id, opts: findIndexOpts });
  const databaseFunc = index === undefined ? create : update;
  return databaseFunc({ collection, newData, opts });
};

const upsertOne = function ({ collection, newData, opts }) {
  const newModel = upsert({ collection, newData, opts });
  return { data: newModel };
};

const upsertMany = function ({ collection, newData, opts }) {
  const newModels = newData.map(datum =>
    upsert({ collection, newData: datum, opts })
  );
  return { data: newModels };
};

module.exports = {
  upsertOne,
  upsertMany,
};
