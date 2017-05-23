'use strict';


const { EngineError } = require('../error');
const { map } = require('../utilities');
const { compileJsl } = require('./compile');


class Jsl {

  constructor({ idl }) {
    this.input = {};
    this.compileHelpers({ idl });
  }

  add(input = {}, { type = 'SYSTEM' } = {}) {
    this.checkNames(input, type);
    Object.assign(this.input, input);
  }

  // Make sure there is no name conflicts between system helpers and
  // user-supplied helpers, by forcing the former to be UPPER_CASE, and
  // forbidding the latter to be so
  checkNames(input, type) {
    const isSystemType = type === 'SYSTEM';
    for (const name of Object.keys(input)) {
      const isSystemName = systemNameRegExp.test(name);
      if (isSystemType && !isSystemName) {
        const message = `JSL helper named '${name}' should be uppercase/underscore only`;
        throw new EngineError(message, { reason: 'UTILITY_ERROR' });
      } else if (!isSystemType && isSystemName) {
        const message = `JSL helper named '${name}' should not be uppercase/underscore only`;
        throw new EngineError(message, { reason: 'UTILITY_ERROR' });
      }
    }
  }

  // Take JSL, inline or not, and turns into `function (...args)`
  // firing the first one,
  // with ARG_1, ARG_2, etc. provided as extra arguments
  compileHelpers({ idl: { helpers = {} } }) {
    const compiledHelpers = map(helpers, helper => {
      return (...args) => {
        // Non-inline helpers only get positional arguments, no parameters
        if (typeof helper === 'function') {
          return helper(...args);
        }

        // Provide ARG_1, ARG_2, etc. to inline JSL
        const [ ARG_1, ARG_2, ARG_3, ARG_4, ARG_5, ARG_6, ARG_7 ] = args;
        const input = { ARG_1, ARG_2, ARG_3, ARG_4, ARG_5, ARG_6, ARG_7 };

        return this.run({ value: helper, input });
      };
    });
    this.add(compiledHelpers, { type: 'USER' });
  }

  // Process (already compiled) JSL function,
  // i.e. fires it and returns its value
  // If this is not JSL, returns as is
  run({
    value,
    input = {},
    errorType: ErrorType = EngineError,
    errorReason = 'UTILITY_ERROR',
  }) {
    try {
      const params = Object.assign({}, this.input, input);
      const jslFunc = compileJsl({ jsl: value, params });

      if (typeof jslFunc !== 'function') { return jslFunc; }
      return jslFunc(params);
    } catch (innererror) {
      const message = `JSL expression failed: '${value}'`;
      throw new ErrorType(message, { reason: errorReason, innererror });
    }
  }
}

const systemNameRegExp = /^[A-Z_]+$/;


module.exports = {
  Jsl,
};
