'use strict';

// Pick database adapter
const pickDatabaseAdapter = function ({ dbAdapters, modelName }) {
  const dbAdapter = dbAdapters[modelName];
  return { dbAdapter };
};

module.exports = {
  pickDatabaseAdapter,
};
