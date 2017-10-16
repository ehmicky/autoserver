'use strict';

// Delegates to database adapter
const queryDatabase = function ({
  dbAdapters,
  modelName,
  command,
  commandInput,
  dryrun: { noWrites },
}) {
  // `dryrun` middleware with create|replace|patch
  if (noWrites) { return; }

  return dbAdapters[modelName][command](commandInput);
};

module.exports = {
  queryDatabase,
};
