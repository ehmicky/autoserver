'use strict';

// Modify models
const replace = function ({ collection, newData }) {
  const method = newData.length === 1 ? replaceOne : replaceMany;
  return method({ collection, newData });
};

const replaceOne = function ({ collection, newData: [data] }) {
  const { _id } = data;
  return collection.replaceOne({ _id }, data);
};

const replaceMany = async function ({ collection, newData }) {
  const bulkCommands = newData
    .map(replacement => getBulkCommand({ replacement }));
  const result = await collection.bulkWrite(bulkCommands);
  return { result };
};

const getBulkCommand = function ({ replacement }) {
  const { _id } = replacement;
  return { replaceOne: { filter: { _id }, replacement, upsert: false } };
};

module.exports = {
  replace,
};
