'use strict';

const { logAdapters } = require('./wrap');

// Retrieves rpc adapter
const getLog = function (provider) {
  const logAdapter = logAdapters[provider];
  if (logAdapter !== undefined) { return logAdapter.wrapped; }

  const message = `Unsupported log provider: '${provider}'`;
  // eslint-disable-next-line fp/no-throw
  throw new Error(message);
};

module.exports = {
  getLog,
};
