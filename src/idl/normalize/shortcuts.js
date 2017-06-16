'use strict';


const { getReadOnlyMap } = require('./read_only');


// Compile-time transformations just meant for runtime performance optimization
const normalizeShortcuts = function ({ idl }) {
  const readOnlyMap = getReadOnlyMap({ idl });

  idl.shortcuts = { readOnlyMap };
  return idl;
};


module.exports = {
  normalizeShortcuts,
};
