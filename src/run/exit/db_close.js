'use strict';

const { wrapCloseFunc } = require('./wrapper');

// Attempts to close database connections
// No new connections will be accepted, but we will wait for ongoing ones to end
const closeDbAdapter = async function ({
  dbAdapter,
  dbAdapter: { type: dbType },
  measures,
}) {
  const status = await mStop({ dbAdapter, dbType, measures });

  return { [dbType]: Boolean(status) };
};

// Close each database connection
const stop = async function ({ dbAdapter: { disconnect } }) {
  await disconnect();
  return true;
};

const mStop = wrapCloseFunc(stop, {
  label: 'shutdown',
  successMessage: 'Successful database disconnection',
  errorMessage: 'Failed to disconnect to database',
  reason: 'DB_ERROR',
});

module.exports = {
  closeDbAdapter,
};
