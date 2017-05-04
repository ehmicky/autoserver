'use strict';


const { getIdlConf } = require('./conf');
const { resolveRefs } = require('./ref_parsing');
const { applyPlugins } = require('./plugins');
const { validateIdl } = require('./validation');
const { normalizeIdl } = require('./normalize');
const { addCustomKeywords } = require('./custom_validation');


// Retrieves IDL definition, after validation and transformation
const getIdl = async function ({ conf }) {
  // Retrieve raw IDL file
  let { idl, baseDir } = await getIdlConf({ conf });
  // Resolve JSON references
  idl = await resolveRefs({ idl, baseDir });
  // Apply idl.plugins
  idl = await applyPlugins({ idl });
  // Validate IDL correctness
  await validateIdl(idl);
  // Transform IDL to normalized form, used by application
  idl = normalizeIdl(idl);
  // Add custom validation keywords, from idl.validation
  addCustomKeywords({ idl });
  return idl;
};


module.exports = {
  getIdl,
};
