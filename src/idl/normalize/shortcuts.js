'use strict';


const { getReadOnlyMap } = require('./read_only');
const { getUserDefaultsMap } = require('./user_defaults');
const { getTransformsMap } = require('./transform_shortcut');
const { getAliasesMap } = require('./aliases');
const { getModelsMap } = require('./models_map');


// Compile-time transformations just meant for runtime performance optimization
const normalizeShortcuts = function ({ idl }) {
  const readOnlyMap = getReadOnlyMap({ idl });
  const userDefaultsMap = getUserDefaultsMap({ idl });
  const transformsMap = getTransformsMap({ idl, type: 'transform' });
  const computesMap = getTransformsMap({ idl, type: 'compute' });
  const aliasesMap = getAliasesMap({ idl });
  const modelsMap = getModelsMap({ idl });

  idl.shortcuts = {
    readOnlyMap,
    userDefaultsMap,
    transformsMap,
    computesMap,
    aliasesMap,
    modelsMap,
  };
  return idl;
};


module.exports = {
  normalizeShortcuts,
};
