'use strict';


// Compile-time transformations just meant for runtime performance optimization
const normalizeShortcuts = function ({ idl }) {
  idl.shortcuts = {};

  return idl;
};


module.exports = {
  normalizeShortcuts,
};
