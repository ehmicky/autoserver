'use strict';

const { dereferenceRefs } = require('../../json_refs');

// Load schema file
const loadFile = function ({ path }) {
  return dereferenceRefs({ path });
};

module.exports = {
  loadFile,
};
