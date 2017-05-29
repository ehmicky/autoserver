'use strict';


// Inline JSL helper function.
// When consumer fires Helper('a', 'b'), inline JSL translates 'a' and 'b'
// into $1 and $2 parameters, and JSL.run() is performed.
// We perform this translation by extending Function, and applying a Proxy.apply
class JslHelper extends Function {
  constructor ({ helper, jsl, useParams }) {
    super();

    Object.assign(this, { helper, jsl, useParams });

    const apply = (_, __, args) => this.run(...args);
    return new Proxy(this, { apply });
  }

  // When creating a new JSL, the new JSL's helpers must be rebound to the
  // new instance. We do this by instantiating a new JslHelper.
  // I.e. helpers inherit the JSL parameters from the current JSL.
  clone({ jsl = this.jsl } = {}) {
    const { helper, useParams } = this;
    return new JslHelper({ helper, jsl, useParams });
  }

  run(...args) {
    const { helper, jsl, useParams } = this;

    // Provide $1, $2, etc. to inline JSL
    const [$1, $2, $3, $4, $5, $6, $7, $8, $9] = args;
    const params = { $1, $2, $3, $4, $5, $6, $7, $8, $9 };

    // Non-inline helpers only get positional arguments, no parameters
    if (typeof helper === 'function') {
      if (useParams) {
        const allParams = Object.assign({}, jsl.params, params);
        return helper(allParams, ...args);
      } else {
        return helper(...args);
      }
    }

    // JSL is run with current instance
    return jsl.run({ value: helper, params });
  }
}


module.exports = {
  JslHelper,
};
