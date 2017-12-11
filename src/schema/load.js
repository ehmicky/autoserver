'use strict';

const { dereferenceRefs } = require('../json_refs');

// Load schema file
const loadFile = function ({ schema }) {
  return dereferenceRefs({ path: schema });
};

module.exports = {
  loadFile,
};
