'use strict';


const { getIdlConf } = require('./conf');
const { validateIdl } = require('./validation');
const { normalizeIdl } = require('./normalize');


// Retrieves IDL definition, after validation and transformation
// TODO: cache this function
const getIdl = async function ({ conf }) {
  const idl = await getIdlConf({ conf });
  await validateIdl(idl);
  const normalizedIdl = normalizeIdl(idl);
  return normalizedIdl;
};


module.exports = {
  getIdl,
};
