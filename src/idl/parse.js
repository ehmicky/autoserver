'use strict';


const { getIdlConf } = require('./conf');
const { validateIdl } = require('./validate');
const { normalizeIdl } = require('./normalize');


// Retrieves IDL definition, after validation and transformation
// TODO: cache this function
const getIdl = function ({ conf }) {
  const idl = getIdlConf({ conf });
  validateIdl(idl);
  const normalizedIdl = normalizeIdl(idl);
  return normalizedIdl;
};


module.exports = {
  getIdl,
};
