'use strict';

const { runJsl } = require('./run');

// Inline JSL helper function.
// When consumer fires Helper('a', 'b'), inline JSL translates 'a' and 'b'
// into $1 and $2 parameters, and JSL.run() is performed.
// We perform this translation by extending Function, and applying a Proxy.apply
class JslHelper extends Function {
  constructor ({ helper, useParams }) {
    super();

    Object.assign(this, { helper, useParams });

    // Parameters are passed by the caller by binding the context `this`
    const apply = (_, context, args) => this.run(context.params, ...args);
    return new Proxy(this, { apply });
  }

  run (params, ...args) {
    const { helper, useParams } = this;

    // Provide $1, $2, etc. to inline JSL
    const [$1, $2, $3, $4, $5, $6, $7, $8, $9] = args;
    const posParams = { $1, $2, $3, $4, $5, $6, $7, $8, $9 };
    const allParams = Object.assign({}, params, posParams);

    // JSL is run
    if (typeof helper !== 'function') {
      return runJsl({ value: helper, params: allParams });
    }

    // Non-inline helpers only get positional arguments, no parameters
    return useParams ? helper(allParams, ...args) : helper(...args);
  }
}

module.exports = {
  JslHelper,
};
