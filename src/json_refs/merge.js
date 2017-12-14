'use strict';

const { get, set, defaultsDeep } = require('lodash');

// Merge resolved JSON reference value back to original document
// We must directly mutate to handle recursions
const mergeRef = function ({ content, keys, refContent }) {
  // Remove `$ref` from keys
  const keysA = keys.slice(0, -1);

  // Lodash's get(content, []) does not work
  const parent = keysA.length === 0 ? content : get(content, keysA);

  const hasSiblings = Object.keys(parent).length > 1;

  if (!hasSiblings) {
    return set(content, keysA, refContent);
  }

  // eslint-disable-next-line fp/no-delete
  delete parent.$ref;
  // Merge should keep symbols because of `REF_SYM`
  defaultsDeep(parent, refContent);
};

module.exports = {
  mergeRef,
};
