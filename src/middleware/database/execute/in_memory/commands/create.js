'use strict';

const { v4: uuidv4 } = require('uuid');

const { throwError } = require('../../../../../error');
const { searchIndexes } = require('../indexes');

const create = function ({ collection, newData }) {
  const data = newData
    .map(datum => createOne({ collection, newData: datum }));
  return { data };
};

const createOne = function ({ collection, newData }) {
  const id = getCreateId({ newData });
  checkCreateId({ collection, id });

  const newModel = { ...newData, id };

  // eslint-disable-next-line fp/no-mutating-methods
  collection.push(newModel);

  return newModel;
};

const getCreateId = function ({ newData: { id } }) {
  return id === undefined ? uuidv4() : id;
};

const checkCreateId = function ({ collection, id }) {
  const models = searchIndexes({ collection, filter: { id } });
  if (models.length === 0) { return; }

  const message = `Model with id '${id}' already exists`;
  throwError(message, { reason: 'DATABASE_MODEL_CONFLICT' });
};

module.exports = {
  create,
  createOne,
};
