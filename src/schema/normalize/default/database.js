'use strict';

// Default `model.database`
const addDefaultDatabase = function (model) {
  if (model.database) { return model; }

  return { ...model, database: 'memory' };
};

module.exports = {
  addDefaultDatabase,
};
