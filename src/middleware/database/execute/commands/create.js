'use strict';

const { v4: uuiv4 } = require('uuid');

const { findIndex } = require('../find');

const create = function ({ collection, newData, opts, opts: { dryrun } }) {
  const id = getCreateId({ collection, newData, opts });
  const newModel = { ...newData, id };

  if (!dryrun) {
    // eslint-disable-next-line fp/no-mutating-methods
    collection.push(newModel);
  }

  return newModel;
};

const getCreateId = function ({ collection, newData: { id }, opts }) {
  if (!id) {
    return uuiv4();
  }

  checkCreateId({ collection, id, opts });

  return id;
};

const checkCreateId = function ({ collection, id, opts }) {
  const findIndexOpts = { ...opts, mustExist: false };
  findIndex({ collection, id, opts: findIndexOpts });
};

const createOne = function ({ collection, newData, opts }) {
  const newModel = create({ collection, newData, opts });
  return { data: newModel };
};

const createMany = function ({ collection, newData, opts }) {
  const newModels = newData.map(datum =>
    create({ collection, newData: datum, opts })
  );
  return { data: newModels };
};

module.exports = {
  create,
  createOne,
  createMany,
};
