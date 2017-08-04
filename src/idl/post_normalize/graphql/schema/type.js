'use strict';

const { getTypeGetter } = require('./types');

// Retrieves the GraphQL type for a given IDL definition
const getType = function (def, opts) {
  // Recursion, while avoiding files circular dependencies
  const optsA = { ...opts, getType };

  const typeGetter = getTypeGetter({ def, opts: optsA });
  const type = typeGetter.value(def, optsA);
  return type;
};

module.exports = {
  getType,
};
