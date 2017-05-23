'use strict';


const { EngineError } = require('../error');
const { map } = require('../utilities');
const { compileJsl } = require('./compile');
const { checkNames } = require('./validation');
const { isJsl } = require('./test');
const { getRawJsl } = require('./tokenize');


class Jsl {

  constructor({ helpers }) {
    this.input = {};
    if (helpers) {
      this.compileHelpers({ helpers });
    }
  }

  add(input = {}, { type = 'SYSTEM' } = {}) {
    checkNames(input, type);
    Object.assign(this.input, input);
  }

  // Take JSL, inline or not, and turns into `function (...args)`
  // firing the first one,
  // with ARG_1, ARG_2, etc. provided as extra arguments
  compileHelpers({ helpers }) {
    const compiledHelpers = map(helpers, helper => {
      // Non-inline helpers only get positional arguments, no parameters
      if (typeof helper === 'function') { return helper; }

      // Constants are left as is
      if (!isJsl({ jsl: helper })) { return helper; }

      // JSL is run with current instance
      return (...args) => {
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
      const paramsKeys = Object.keys(params);
      const jslFunc = compileJsl({ jsl: value, paramsKeys });

      if (typeof jslFunc !== 'function') { return jslFunc; }
      return jslFunc(params);
    } catch (innererror) {
      // JSL without parenthesis
      const rawJsl = getRawJsl({ jsl: value });
      // If non-inline function, function name
      const funcName = typeof value === 'function' &&
        value.name &&
        `${value.name}()`;
      const expression = rawJsl || funcName || value;
      const message = `JSL expression failed: '${expression}'`;
      throw new ErrorType(message, { reason: errorReason, innererror });
    }
  }
}


module.exports = {
  Jsl,
};
