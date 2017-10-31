'use strict';

// Create models
const create = function ({ collection, newData }) {
  const method = newData.length === 1 ? createOne : createMany;
  return method({ collection, newData });
};

const createOne = function ({ collection, newData }) {
  return collection.insertOne(newData[0]);
};

const createMany = function ({ collection, newData }) {
  return collection.insertMany(newData);
};

module.exports = {
  create,
};
