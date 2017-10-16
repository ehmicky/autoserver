'use strict';

const { renameIdsInput, renameIdsOutput } = require('./rename_ids');

// Delegates to database adapter
const queryDatabase = async function ({
  dbAdapters,
  modelName,
  commandInput,
  commandInput: { command },
  dryrun: { noWrites },
}) {
  // `dryrun` middleware with create|replace|patch
  if (noWrites) { return; }

  const dbAdapter = dbAdapters[modelName];

  const commandInputA = renameIdsInput({ dbAdapter, commandInput });

  const dbData = await dbAdapter.query(commandInputA);

  if (command !== 'find') { return dbData; }
  const dbDataA = renameIdsOutput({ dbAdapter, dbData });
  return dbDataA;
};

module.exports = {
  queryDatabase,
};
