'use strict';


const { getIdlConf } = require('./conf');
const { resolveRefs } = require('./ref_parsing');
const { applyPlugins } = require('./plugins');
const { validateIdl } = require('./validation');
const { normalizeIdl } = require('./normalize');
const { addCustomKeywords } = require('./custom_validation');


// Retrieves IDL definition, after validation and transformation
const getIdl = async function ({ conf }) {
  let { idl, baseDir } = await getIdlConf({ conf });
  idl = await resolveRefs({ idl, baseDir });
  idl = await applyPlugins({ idl });
  await validateIdl(idl);
  idl = normalizeIdl(idl);
  addCustomKeywords({ idl });
  return idl;
};


module.exports = {
  getIdl,
};
