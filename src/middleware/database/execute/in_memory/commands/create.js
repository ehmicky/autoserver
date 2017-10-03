'use strict';

const { throwError } = require('../../../../../error');
const { searchIndexes } = require('../indexes');

const create = function ({ collection, newData }) {
  const data = newData
    .map(datum => createOne({ collection, newData: datum }));
  return { data };
};

const createOne = function ({ collection, newData, newData: { id } }) {
  checkCreateId({ collection, id });

  const newModel = { ...newData, id };

  // eslint-disable-next-line fp/no-mutating-methods
  collection.push(newModel);

  return newModel;
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
