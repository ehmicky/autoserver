'use strict';


const { getReadOnlyMap } = require('./read_only');
const { getUserDefaultsMap } = require('./user_defaults');


// Compile-time transformations just meant for runtime performance optimization
const normalizeShortcuts = function ({ idl }) {
  const readOnlyMap = getReadOnlyMap({ idl });
  const userDefaultsMap = getUserDefaultsMap({ idl });

  idl.shortcuts = { readOnlyMap, userDefaultsMap };
  return idl;
};


module.exports = {
  normalizeShortcuts,
};
