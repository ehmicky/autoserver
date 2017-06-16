'use strict';


const { getReadOnlyMap } = require('./read_only');
const { getUserDefaultsMap } = require('./user_defaults');
const { getTransformsMap } = require('./transform_shortcut');


// Compile-time transformations just meant for runtime performance optimization
const normalizeShortcuts = function ({ idl }) {
  const readOnlyMap = getReadOnlyMap({ idl });
  const userDefaultsMap = getUserDefaultsMap({ idl });
  const transformsMap = getTransformsMap({ idl, type: 'transform' });
  const computesMap = getTransformsMap({ idl, type: 'compute' });

  idl.shortcuts = {
    readOnlyMap,
    userDefaultsMap,
    transformsMap,
    computesMap,
  };
  return idl;
};


module.exports = {
  normalizeShortcuts,
};
