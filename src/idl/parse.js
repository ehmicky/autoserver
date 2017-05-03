'use strict';


const { getIdlConf } = require('./conf');
const { validateIdl } = require('./validation');
const { normalizeIdl } = require('./normalize');
const { resolveRefs } = require('./ref_parsing');
const { applyPlugins } = require('./plugins');


// Retrieves IDL definition, after validation and transformation
// TODO: cache this function
const getIdl = async function ({ conf }) {
  const { idl, baseDir } = await getIdlConf({ conf });
  const parsedIdl = await resolveRefs({ idl, baseDir });
  const idlWithPlugins = await applyPlugins({ idl });
  await validateIdl(parsedIdl);
  const normalizedIdl = normalizeIdl(parsedIdl);
  return normalizedIdl;
};


module.exports = {
  getIdl,
};
