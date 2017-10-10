'use strict';

const { throwError } = require('../../../../../error');

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
  const hasModel = collection.some(model => model.id === id);
  if (!hasModel) { return; }

  const message = `Model with id '${id}' already exists`;
  throwError(message, { reason: 'DATABASE_MODEL_CONFLICT' });
};

module.exports = {
  create,
  createOne,
};
