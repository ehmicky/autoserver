'use strict';

// Pick database adapter
const pickDatabaseAdapter = function ({ dbAdapters, collname }) {
  const dbAdapter = dbAdapters[collname];
  return { dbAdapter };
};

module.exports = {
  pickDatabaseAdapter,
};
