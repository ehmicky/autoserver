'use strict';


const { mapValues } = require('lodash');

const { compileJsl } = require('../jsl');
const { EngineStartupError } = require('../error');
const { transform } = require('../utilities');


// Compile all the IDL's JSL
const compileIdlJsl = function ({ idl }) {
  idl = compileTopLevelJsl({ idl });
  idl.models = compileModelsJsl({ models: idl.models });
  console.log(idl.models.pet.properties.created_time.compute);
  return idl;
};

// Compile top-level attributes's JSL, e.g. `helpers`
const compileTopLevelJsl = function ({ idl }) {
  for (const attrName of jslTopLevelAttributes) {
    idl[attrName] = mapValues(idl[attrName], jsl => compileJsl({ jsl }));
  }
  return idl;
};
// These attributes might contain JSL
const jslTopLevelAttributes = ['helpers'];

// Compile models attributes's JSL, e.g. `transform`
const compileModelsJsl = function ({ models }) {
  transform({ transforms: modelTransforms })({ input: models });
  return models;
};
// These attributes might contain JSL
const jslModelAttributes = ['default', 'defaultOut', 'transform', 'transformOut', 'compute', 'computeOut'];
// Compile JSL for all attributes that might contain it
const modelTransforms = [
  ...jslModelAttributes.map(attrName => ({
    [attrName]: ({ value: jsl }) => ({
      [attrName]: compileJslValue({ jsl }),
    }),
  })),
];

const compileJslValue = function ({ jsl }) {
  try {
    return compileJsl({ jsl });
  } catch (innererror) {
    throw new EngineStartupError(`JSL syntax error: ${jsl}`, { reason: 'IDL_VALIDATION', innererror });
  }
};


module.exports = {
  compileIdlJsl,
};
