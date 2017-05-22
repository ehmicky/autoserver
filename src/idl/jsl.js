'use strict';


const { compileJsl } = require('../jsl');
const { EngineStartupError } = require('../error');
const { transform, map, recurseMap } = require('../utilities');


// Compile all the IDL's JSL
const compileIdlJsl = function ({ idl }) {
  idl.helpers = idl.helpers === undefined ? {} : idl.helpers;
  idl.variables = idl.variables === undefined ? {} : idl.variables;
  idl.validation = idl.validation === undefined ? {} : idl.validation;

  idl.helpersGet = compileHelpers({ idl });
  idl.variablesGet = compileVariables({ idl });
  idl.validation = compileValidation({ idl });
  idl.models = compileModels({ idl });
  return idl;
};

// Take JSL, inline or not, and turns into `function (...args)`
// firing the first one,
// with $1, $2, etc. provided as extra arguments
const compileHelpers = function ({ idl }) {
  return jsl => {
    return Object.entries(idl.helpers)
      .map(([name, helper]) => {
        const jslFunc = compileJsl({
          jsl: helper,
          idl,
          target: 'helpers',
          error,
        });

        const func = (...args) => {
          // Non-inline helpers only get positional arguments, no variables
          if (typeof jslFunc === 'function' && !jslFunc.isInlineJsl) {
            return jslFunc(...args);
          }

          // Provide $1, $2, etc. to inline JSL
          const [$1, $2, $3, $4, $5, $6, $7, $8, $9] = args;
          const input = { $1, $2, $3, $4, $5, $6, $7, $8, $9 };

          return jsl.run({ value: jslFunc, input });
        };
        return { [name]: func };
      })
      .reduce((memo, obj) => Object.assign(memo, obj), {});
  };
};

const compileVariables = function ({ idl }) {
  return jsl => {
    return Object.entries(idl.variables)
      .map(([name, variable]) => {
        const jslFunc = compileJsl({
          jsl: variable,
          idl,
          target: 'variables',
          error,
        });

        const func = () => {
          return jsl.run({ value: jslFunc });
        };
        return { [name]: func };
      })
      .reduce((memo, obj) => Object.assign(memo, obj), {});
  };
};

// Compile idl.validation.test|message JSL
const compileValidation = function ({ idl }) {
  return map(idl.validation, validator => {
    return map(validator, (jsl, attrName) => {
      if (!['test', 'message'].includes(attrName)) { return jsl; }
      return compileJsl({ jsl, idl, target: 'validation', error });
    });
  });
};

// These attributes might contain JSL
const jslModelAttributes = [
  'default',
  'transform',
  'compute',
  'transformOut',
  'computeOut',
];

// Compile models attributes's JSL, e.g. `transform`
const compileModels = function ({ idl }) {
  const transforms = jslModelAttributes.map(attrName => {
    return {
      [attrName]: ({ value }) => {
        const func = recurseMap(value, jsl => {
          return compileJsl({ jsl, idl, target: 'model', error });
        });
        return { [attrName]: func };
      },
    };
  });
  transform({ transforms })({ input: idl.models });
  return idl.models;
};

const error = {
  type: EngineStartupError,
  reason: 'IDL_VALIDATION',
};


module.exports = {
  compileIdlJsl,
};
