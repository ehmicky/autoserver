'use strict';

// Pick database adapter
const pickDatabaseAdapter = function ({ dbAdapters, modelname }) {
  const dbAdapter = dbAdapters[modelname];
  return { dbAdapter };
};

module.exports = {
  pickDatabaseAdapter,
};
