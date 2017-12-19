'use strict';

// Delete models
const deleteFunc = function ({ collection, deletedIds }) {
  const func = deletedIds.length === 1 ? deleteOne : deleteMany;
  return func({ collection, deletedIds });
};

const deleteOne = function ({ collection, deletedIds }) {
  const [_id] = deletedIds;
  return collection.deleteOne({ _id });
};

const deleteMany = function ({ collection, deletedIds }) {
  const filter = { _id: { $in: deletedIds } };
  return collection.deleteMany(filter);
};

module.exports = {
  delete: deleteFunc,
};
