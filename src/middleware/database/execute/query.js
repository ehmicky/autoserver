'use strict';

const { renameIdsInput, renameIdsOutput } = require('./rename_ids');

// Delegates to database adapter
const queryDatabase = async function ({
  dbAdapters,
  modelName,
  command,
  commandInput,
  dryrun: { noWrites },
}) {
  // `dryrun` middleware with create|replace|patch
  if (noWrites) { return; }

  const dbAdapter = dbAdapters[modelName];

  const commandInputA = renameIdsInput({ dbAdapter, commandInput });

  const dbData = await dbAdapter[command](commandInputA);

  const dbDataA = renameIdsOutput({ dbAdapter, dbData });

  return dbDataA;
};

module.exports = {
  queryDatabase,
};
