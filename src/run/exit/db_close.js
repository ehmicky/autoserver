'use strict';

const { uniq } = require('../../utilities');

const { wrapCloseFunc } = require('./wrapper');

// Attempts to close database connections
// No new connections will be accepted, but we will wait for ongoing ones to end
const closeDbAdapters = function ({ dbAdapters, config, measures }) {
  const dbAdaptersA = Object.values(dbAdapters);
  // The same `dbAdapter` can be used for several models
  const dbAdaptersB = uniq(dbAdaptersA);

  return dbAdaptersB.map(adapter =>
    eCloseDbAdapter({ type: 'databases', adapter, config, measures }));
};

const closeDbAdapter = function ({ adapter: { disconnect } }) {
  return disconnect();
};

const eCloseDbAdapter = wrapCloseFunc(closeDbAdapter);

module.exports = {
  closeDbAdapters,
};
