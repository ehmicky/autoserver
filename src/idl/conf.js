'use strict';

const { throwError } = require('../error');
const { dereferenceRefs, pRealpath } = require('../utilities');

// Retrieve the configuration from a path to a JSON or YAML file
const getIdlConf = async function ({ serverOpts: { conf } }) {
  const idlPath = await getIdlPath({ conf });
  const idl = await resolveJsonRefs({ idlPath });
  return idl;
};

const getIdlPath = async function ({ conf }) {
  try {
    return await pRealpath(conf);
  } catch (error) {
    const message = `Configuration file does not exist: '${conf}'`;
    throwError(message, {
      reason: 'CONFIGURATION_LOADING',
      innererror: error,
    });
  }
};

// Resolve JSON references, i.e. $ref
// json-schema-ref-parser must load the file itself, i.e. a string must be
// passed to it, not the parsed object, so it knows the base of relative $refs.
// Because of this, json-schema-ref-parser needs to be responsible for loading
// and parsing the IDL file.
const resolveJsonRefs = async function ({ idlPath }) {
  try {
    const parsedIdl = await dereferenceRefs({ idlPath });
    return parsedIdl;
  } catch (error) {
    const message = 'Could not resolve references \'$ref\'';
    throwError(message, {
      reason: 'IDL_SYNTAX_ERROR',
      innererror: error,
    });
  }
};

module.exports = {
  getIdlConf,
};
