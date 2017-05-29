'use strict';


// Inline JSL helper function.
// When consumer fires Helper('a', 'b'), inline JSL translates 'a' and 'b'
// into $1 and $2 parameters, and JSL.run() is performed.
// We perform this translation by extending Function, and applying a Proxy.apply
class JslHelper extends Function {
  constructor ({ helper, jsl }) {
    super();

    Object.assign(this, { helper, jsl });

    const apply = (_, __, args) => this.run(...args);
    return new Proxy(this, { apply });
  }

  // When creating a new JSL, the new JSL's helpers must be rebound to the
  // new instance. We do this by instantiating a new JslHelper.
  // I.e. helpers inherit the JSL parameters from the current JSL.
  clone({ jsl = this.jsl } = {}) {
    const { helper } = this;
    return new JslHelper({ helper, jsl });
  }

  run(...args) {
    // Provide $1, $2, etc. to inline JSL
    const [$1, $2, $3, $4, $5, $6, $7, $8, $9] = args;
    const params = { $1, $2, $3, $4, $5, $6, $7, $8, $9 };

    const { helper, jsl } = this;
    // JSL is run with current instance
    return jsl.run({ value: helper, params });
  }
}


module.exports = {
  JslHelper,
};
