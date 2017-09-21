'use strict';

const { v4: uuiv4 } = require('uuid');

const { throwError } = require('../../../../error');
const { findIndexes } = require('../find');

const create = function ({ collection, newData }) {
  const newModels = newData
    .map(datum => createOne({ collection, newData: datum }));
  return { data: newModels };
};

const createOne = function ({ collection, newData }) {
  const id = getCreateId({ collection, newData });
  const newModel = { ...newData, id };

  // eslint-disable-next-line fp/no-mutating-methods
  collection.push(newModel);

  return newModel;
};

const getCreateId = function ({ collection, newData: { id } }) {
  if (!id) {
    return uuiv4();
  }

  checkCreateId({ collection, id });

  return id;
};

const checkCreateId = function ({ collection, id }) {
  const models = findIndexes({ collection, filter: { id }, idCheck: false });

  if (models.length > 0) {
    const message = `Model with id ${id} already exists`;
    throwError(message, { reason: 'DATABASE_MODEL_CONFLICT' });
  }
};

module.exports = {
  create,
  createOne,
};
