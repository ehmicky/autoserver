'use strict';

const { normalizeCommands } = require('./commands');
const { normalizeModels } = require('./models');
const { normalizeHelpers } = require('./helpers');
const { normalizeShortcuts } = require('./shortcuts');
const { normalizeGraphQL } = require('./graphql');

// Normalize IDL definition
const normalizeIdl = function ({ idl, serverOpts, startupLog }) {
  const commandsPerf = startupLog.perf.start('commands', 'normalize');
  idl = normalizeCommands({ idl });
  commandsPerf.stop();

  const modelsPerf = startupLog.perf.start('models', 'normalize');
  idl = normalizeModels({ idl });
  modelsPerf.stop();

  const helpersPerf = startupLog.perf.start('helpers', 'normalize');
  idl = normalizeHelpers({ idl });
  helpersPerf.stop();

  const shortcutsPerf = startupLog.perf.start('shortcuts', 'normalize');
  idl = normalizeShortcuts({ idl });
  shortcutsPerf.stop();

  const graphqlPerf = startupLog.perf.start('graphql', 'normalize');
  idl = normalizeGraphQL({ idl, serverOpts, startupLog });
  graphqlPerf.stop();

  return idl;
};

module.exports = {
  normalizeIdl,
};
