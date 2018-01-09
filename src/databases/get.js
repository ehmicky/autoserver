'use strict';

const { databaseAdapters } = require('./wrap');

// Retrieves database adapter
const getDatabase = function (database) {
  const databaseA = databaseAdapters[database];
  if (databaseA !== undefined) { return databaseA.wrapped; }

  const message = `Unsupported database: '${database}'`;
  // eslint-disable-next-line fp/no-throw
  throw new Error(message);
};

module.exports = {
  getDatabase,
};
