'use strict';

// Modify models
const upsert = function ({ collection, newData }) {
  const method = newData.length === 1 ? upsertOne : upsertMany;
  return method({ collection, newData });
};

const upsertOne = function ({ collection, newData: [data] }) {
  const { _id } = data;
  return collection.upsertOne({ _id }, data);
};

const upsertMany = async function ({ collection, newData }) {
  const bulkCommands = newData
    .map(replacement => getBulkCommand({ replacement }));
  const result = await collection.bulkWrite(bulkCommands);
  return { result };
};

const getBulkCommand = function ({ replacement }) {
  const { _id } = replacement;
  return { replaceOne: { filter: { _id }, replacement, upsert: true } };
};

module.exports = {
  upsert,
};
