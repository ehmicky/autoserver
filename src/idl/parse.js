'use strict';

const { makeImmutable } = require('../utilities');

const { getIdlConf } = require('./conf');
const { resolveRefs } = require('./ref_parsing');
const { applyPlugins } = require('./plugins');
const { validateIdl } = require('./validation');
const { normalizeIdl } = require('./normalize');
const { addCustomKeywords } = require('./custom_validation');

// Retrieves IDL definition, after validation and transformation
const getIdl = async function ({
  serverOpts,
  serverOpts: { conf },
  startupLog,
}) {
  const perf = startupLog.perf.start('idl');

  // Retrieve raw IDL file
  const confPerf = startupLog.perf.start('conf', 'idl');
  const { idl: oIdl, baseDir } = await getIdlConf({ conf });
  confPerf.stop();

  // Resolve JSON references
  const refsPerf = startupLog.perf.start('refs', 'idl');
  const resolvedIdl = await resolveRefs({ idl: oIdl, baseDir });
  refsPerf.stop();

  // Apply idl.plugins
  const pluginsPerf = startupLog.perf.start('plugins', 'idl');
  const pluginIdl = await applyPlugins({ idl: resolvedIdl });
  pluginsPerf.stop();

  // Validate IDL correctness
  const validatePerf = startupLog.perf.start('validate', 'idl');
  await validateIdl({ idl: pluginIdl });
  validatePerf.stop();

  // Transform IDL to normalized form, used by application
  const normalizePerf = startupLog.perf.start('normalize', 'idl');
  const idl = normalizeIdl({ idl: pluginIdl, serverOpts, startupLog });
  normalizePerf.stop();

  // Add custom validation keywords, from idl.validation
  const customValidationPerf = startupLog.perf.start('customValidation', 'idl');
  addCustomKeywords({ idl });
  customValidationPerf.stop();

  makeImmutable(idl);

  perf.stop();
  return idl;
};

module.exports = {
  getIdl,
};
