'use strict';

const { wrapCommand } = require('./wrap');

// Delete models
const deleteFunc = function ({ collection, deletedIds }) {
  const method = deletedIds.length === 1 ? deleteOne : deleteMany;
  return method({ collection, deletedIds });
};

const deleteOne = function ({ collection, deletedIds }) {
  const [id] = deletedIds;
  return collection.deleteOne({ id });
};

const deleteMany = function ({ collection, deletedIds }) {
  const filter = { _id: { $in: deletedIds } };
  return collection.deleteMany(filter);
};

const wDelete = wrapCommand.bind(null, deleteFunc);

module.exports = {
  delete: wDelete,
};
