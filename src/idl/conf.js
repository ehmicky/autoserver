'use strict';

const { addErrorHandler } = require('../error');
const { dereferenceRefs } = require('../ref_parser');

// Retrieve the configuration from a path to a JSON or YAML file
const getIdlConf = function ({ idlPath }) {
  return eResolveJsonRefs({ idlPath });
};

// Resolve JSON references, i.e. $ref
// json-schema-ref-parser must load the file itself, i.e. a string must be
// passed to it, not the parsed object, so it knows the base of relative $refs.
// Because of this, json-schema-ref-parser needs to be responsible for loading
// and parsing the IDL file.
const resolveJsonRefs = function ({ idlPath }) {
  return dereferenceRefs({ path: idlPath });
};

const eResolveJsonRefs = addErrorHandler(resolveJsonRefs, {
  message: 'Could not resolve references \'$ref\'',
  reason: 'IDL_SYNTAX_ERROR',
});

module.exports = {
  getIdlConf,
};
