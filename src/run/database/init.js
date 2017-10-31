'use strict';

const { omit } = require('../../utilities');

const { addAllErrorHandlers } = require('./error');
const { startConnection } = require('./connect');
const { bindAdapters } = require('./bind');

// Initialize each database connection
const initAdapters = async function ({
  adapters,
  schema,
  runOpts,
  measures,
}) {
  // Should use `options`, not `runOpts.db`
  const runOptsA = omit(runOpts, 'db');

  const adaptersA = addAllErrorHandlers({ adapters });

  const connectionsPromises = adaptersA.map(adapter => startConnection({
    adapter,
    schema,
    runOpts: runOptsA,
    measures,
  }));
  const connections = await Promise.all(connectionsPromises);

  const adaptersB = bindAdapters({
    adapters: adaptersA,
    connections,
    schema,
    runOpts: runOptsA,
  });

  return adaptersB;
};

module.exports = {
  initAdapters,
};
