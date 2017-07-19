'use strict';

const { makeImmutable, reduceAsync } = require('../utilities');

const { getIdlConf } = require('./conf');
const { resolveRefs } = require('./ref_parsing');
const { applyPlugins } = require('./plugins');
const { validateIdl } = require('./validation');
const { normalizeIdl } = require('./normalize');
const { addCustomKeywords } = require('./custom_validation');

const processors = [
  // Retrieve raw IDL file
  getIdlConf,
  // Resolve JSON references
  resolveRefs,
  // Apply idl.plugins
  applyPlugins,
  // Validate IDL correctness
  validateIdl,
  // Transform IDL to normalized form, used by application
  normalizeIdl,
  // Add custom validation keywords, from idl.validation
  addCustomKeywords,
];

// Retrieves IDL definition, after validation and transformation
const getIdl = async function ({
  serverOpts,
  serverOpts: { conf },
  startupLog,
}) {
  const idlPerf = startupLog.perf.start('idl');

  const finalIdl = await reduceAsync(processors, async (idl, processor) => {
    const perf = startupLog.perf.start(processor.name, 'idl');
    const newIdl = await processor({ idl, serverOpts, startupLog });
    perf.stop();
    return newIdl;
  }, conf);

  makeImmutable(finalIdl);

  idlPerf.stop();
  return finalIdl;
};

module.exports = {
  getIdl,
};
