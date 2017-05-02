'use strict';


const { mapValues } = require('lodash');

const { compileJsl } = require('../jsl');
const { EngineStartupError } = require('../error');
const { transform } = require('../utilities');


// Compile all the IDL's JSL
const compileIdlJsl = function ({ idl }) {
  idl = compileTopLevelJsl({ idl });
  idl.models = compileModelsJsl({ idl });
  return idl;
};

// Top-level attributes that can contain JSL
const jslTopLevelAttributes = ['helpers', 'variables'];

// Compile top-level attributes's JSL, e.g. `helpers` or `variables`
const compileTopLevelJsl = function ({ idl }) {
  const topLevelJsl = jslTopLevelAttributes.map(attrName => {
    if (!idl[attrName]) { return {}; }
    return mapValues(idl[attrName], jsl => compileJslValue({ jsl, idl, target: attrName }));
  });
  Object.assign(idl, topLevelJsl);
  return idl;
};

// Compile models attributes's JSL, e.g. `transform`
const compileModelsJsl = function ({ idl }) {
  transform({ transforms: modelTransforms({ idl }) })({ input: idl.models });
  return idl.models;
};

// These attributes might contain JSL
const jslModelAttributes = [
  { attrName: 'default', target: 'modelInput' },
  { attrName: 'transform', target: 'modelInput' },
  { attrName: 'compute', target: 'modelInput' },
  { attrName: 'defaultOut', target: 'modelOutput' },
  { attrName: 'transformOut', target: 'modelOutput' },
  { attrName: 'computeOut', target: 'modelOutput' },
];

// Compile JSL for all attributes that might contain it
const modelTransforms = function ({ idl }) {
  return jslModelAttributes.map(({ attrName, target }) => ({
    [attrName]: ({ value: jsl }) => ({
      [attrName]: compileJslValue({ jsl, idl, target }),
    }),
  }));
};

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
