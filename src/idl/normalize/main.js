'use strict';

const { normalizeCommands } = require('./commands');
const { normalizeModels } = require('./models');
const { normalizeHelpers } = require('./helpers');
const { normalizeShortcuts } = require('./shortcuts');
const { normalizeGraphQL } = require('./graphql');

// Normalize IDL definition
const normalizeIdl = function ({ idl: oIdl, serverOpts, startupLog }) {
  const commandsPerf = startupLog.perf.start('commands', 'normalize');
  const idlWithCommands = normalizeCommands({ idl: oIdl });
  commandsPerf.stop();

  const modelsPerf = startupLog.perf.start('models', 'normalize');
  const idlWithModels = normalizeModels({ idl: idlWithCommands });
  modelsPerf.stop();

  const helpersPerf = startupLog.perf.start('helpers', 'normalize');
  const idlWithHelpers = normalizeHelpers({ idl: idlWithModels });
  helpersPerf.stop();

  const shortcutsPerf = startupLog.perf.start('shortcuts', 'normalize');
  const idlWithShortcuts = normalizeShortcuts({ idl: idlWithHelpers });
  shortcutsPerf.stop();

  const graphqlPerf = startupLog.perf.start('graphql', 'normalize');
  const idl = normalizeGraphQL({ idl: idlWithShortcuts, serverOpts, startupLog });
  graphqlPerf.stop();

  return idl;
};

module.exports = {
  normalizeIdl,
};
