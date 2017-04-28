'use strict';


const { mapValues } = require('lodash');

const { compileJsl } = require('../jsl');
const { EngineStartupError } = require('../error');
const { transform } = require('../utilities');


// Compile all the IDL's JSL
const compileIdlJsl = function ({ idl }) {
  addDefaultTopLevelJsl({ idl });
  const customJsl = getTopLevelJslKeys({ idl });
  idl = compileTopLevelJsl({ idl, customJsl });
  idl.models = compileModelsJsl({ models: idl.models, customJsl });
  return idl;
};

const addDefaultTopLevelJsl = function ({ idl }) {
  for (const attrName of jslTopLevelAttributes) {
    idl[attrName] = idl[attrName] || {};
  }
};

// Compile top-level attributes's JSL, e.g. `helpers`
const compileTopLevelJsl = function ({ idl, customJsl }) {
  for (const attrName of jslTopLevelAttributes) {
    idl[attrName] = mapValues(idl[attrName], jsl => compileJslValue({ jsl, customJsl }));
  }
  return idl;
};
// These attributes might contain JSL
const jslTopLevelAttributes = ['helpers'];

// Retrieve list of custom functions, variables, etc. to add to parameter list during JSL compilation
const getTopLevelJslKeys = function ({ idl }) {
  return jslTopLevelAttributes.reduce((memo, attrName) => memo.concat(Object.keys(idl[attrName])), []);
};

// Compile models attributes's JSL, e.g. `transform`
const compileModelsJsl = function ({ models, customJsl }) {
  transform({ transforms: modelTransforms({ customJsl }) })({ input: models });
  return models;
};
// These attributes might contain JSL
const jslModelAttributes = ['default', 'defaultOut', 'transform', 'transformOut', 'compute', 'computeOut'];
// Compile JSL for all attributes that might contain it
const modelTransforms = ({ customJsl }) => [
  ...jslModelAttributes.map(attrName => ({
    [attrName]: ({ value: jsl }) => ({
      [attrName]: compileJslValue({ jsl, customJsl }),
    }),
  })),
];

const compileJslValue = function ({ jsl, customJsl }) {
  try {
    return compileJsl({ jsl, customJsl });
  } catch (innererror) {
    throw new EngineStartupError(`JSL syntax error: ${jsl}`, { reason: 'IDL_VALIDATION', innererror });
  }
};


module.exports = {
  compileIdlJsl,
};
