'use strict';

// Default `coll.database`
const addDefaultDatabase = function (coll) {
  if (coll.database) { return coll; }

  return { ...coll, database: 'memory' };
};

module.exports = {
  addDefaultDatabase,
};
