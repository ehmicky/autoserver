'use strict';


const { compileJsl, getJslVariables, runJsl } = require('../jsl');
const { EngineStartupError } = require('../error');
const { transform, memoize, map, recurseMap } = require('../utilities');


// Compile all the IDL's JSL
const compileIdlJsl = function ({ idl }) {
  idl = compileTopLevelJsl({ idl });
  idl.validation = compileValidationJsl({ idl });
  idl.models = compileModelsJsl({ idl });
  return idl;
};

// Compile top-level attributes's JSL, e.g. `helpers` or `variables`
const compileTopLevelJsl = function ({ idl }) {
  idl.helpers = map(idl.helpers || {}, jsl => {
    return wrapHelpersJsl({ jsl, idl });
  });
  idl.variables = map(idl.variables || {}, jsl => {
    return wrapVariablesJsl({ jsl, idl });
  });
  return idl;
};

// Compile idl.validation.test|message JSL
const compileValidationJsl = function ({ idl }) {
  return map(idl.validation || {}, validator => {
    return map(validator, (jsl, attrName) => {
      if (!['test', 'message'].includes(attrName)) { return jsl; }
      return compileJslValue({ jsl, idl, target: 'validation' });
    });
  });
};

const wrapVariablesJsl = ({ jsl, idl }) => {
  const jslFunc = compileJslValue({ jsl, idl, target: 'variables' });

  // We memoize for performance reasons, i.e. variables should be pure functions
  // The memoizer is recreated at each request though, to avoid memory leaks
  // The first invocation is done per request, providing
  // request-specific information
  // The second invovation is done when the variables is actually used
  return ({ jslInput }) => memoize(() => {
    return runJsl(jslFunc, jslInput);
  });
};

// Take JSL, inline or not, and turns into `function (...args)`
// firing the first one,
// with $1, $2, etc. provided as extra arguments
const wrapHelpersJsl = ({ jsl, idl }) => {
  const jslFunc = compileJslValue({ jsl, idl, target: 'helpers' });

  // We memoize for performance reasons, i.e. helpers should be pure functions
  // The memoizer is recreated at each request though, to avoid memory leaks
  // The first invocation is done per request, providing
  // request-specific information
  // The second invovation is done when the helper is actually used
  return ({ jslInput }) => memoize((...args) => {
    // Helpers can be non-JSL, but still needs to be fired
    // as function by consumers
    if (typeof jslFunc !== 'function') { return jslFunc; }

    // Non-inline helpers only get positional arguments, no variables
    if (!jslFunc.isInlineJsl) {
      return jslFunc(...args);
    }

    // jslInput will contain other variables|helpers,
    // so they can reference each other
    const jslArgs = getJslVariables(jslFunc, jslInput);

    // Provide $1, $2, etc. to inline JSL
    const [$1, $2, $3, $4, $5, $6, $7, $8, $9] = args;
    Object.assign(jslArgs, { $1, $2, $3, $4, $5, $6, $7, $8, $9 });

    return jslFunc(jslArgs);
  });
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
  return recurseMap(jsl, jslLeaf => {
    return compileJsl({
      jsl: jslLeaf,
      idl,
      target,
      error: { type: EngineStartupError, reason: 'IDL_VALIDATION' },
    });
  });
};


module.exports = {
  compileIdlJsl,
};
