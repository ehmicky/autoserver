'use strict';


const { mapValues } = require('lodash');

const { compileJsl, jslTopLevelAttributes, jslModelInputAttributes, jslModelOutputAttributes } = require('../jsl');
const { EngineStartupError } = require('../error');
const { transform } = require('../utilities');


// Compile all the IDL's JSL
const compileIdlJsl = function ({ idl }) {
  addDefaultTopLevelJsl({ idl });
  idl = compileTopLevelJsl({ idl });
  idl.models = compileModelsJsl({ idl });
  return idl;
};

const addDefaultTopLevelJsl = function ({ idl }) {
  for (const attrName of jslTopLevelAttributes) {
    idl[attrName] = idl[attrName] || {};
  }
};

// Compile top-level attributes's JSL, e.g. `helpers` or `variables`
const compileTopLevelJsl = function ({ idl }) {
  for (const attrName of jslTopLevelAttributes) {
    idl[attrName] = mapValues(idl[attrName], jsl => compileJslValue({ jsl, idl, target: attrName }));
  }
  return idl;
};

// Compile models attributes's JSL, e.g. `transform`
const compileModelsJsl = function ({ idl }) {
  transform({ transforms: modelTransforms({ idl }) })({ input: idl.models });
  return idl.models;
};
// Compile JSL for all attributes that might contain it
const modelTransforms = ({ idl }) => [
  ...jslModelInputAttributes.map(modelTransform({ idl, target: 'modelInput' })),
  ...jslModelOutputAttributes.map(modelTransform({ idl, target: 'modelOutput' })),
];
const modelTransform = ({ idl, target }) => attrName => ({
  [attrName]: ({ value: jsl }) => ({
    [attrName]: compileJslValue({ jsl, idl, target }),
  }),
});

const compileJslValue = function ({ jsl, idl, target }) {
  try {
    return compileJsl({ jsl, idl, target });
  } catch (innererror) {
    throw new EngineStartupError(`JSL syntax error: ${jsl}`, { reason: 'IDL_VALIDATION', innererror });
  }
};


module.exports = {
  compileIdlJsl,
};
