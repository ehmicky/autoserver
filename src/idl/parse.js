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
  let { idl, baseDir } = await getIdlConf({ conf });
  confPerf.stop();

  // Resolve JSON references
  const refsPerf = startupLog.perf.start('refs', 'idl');
  idl = await resolveRefs({ idl, baseDir });
  refsPerf.stop();

  // Apply idl.plugins
  const pluginsPerf = startupLog.perf.start('plugins', 'idl');
  idl = await applyPlugins({ idl });
  pluginsPerf.stop();

  // Validate IDL correctness
  const validatePerf = startupLog.perf.start('validate', 'idl');
  await validateIdl(idl);
  validatePerf.stop();

  // Transform IDL to normalized form, used by application
  const normalizePerf = startupLog.perf.start('normalize', 'idl');
  idl = normalizeIdl({ idl, serverOpts, startupLog });
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
