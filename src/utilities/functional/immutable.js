'use strict';

// Deeply Object.freeze() over an object.
// Since linting enforces immutability, we only need to (and should) perform
// this on values that are passed to library caller.
// This directy mutates the argument for performance reasons
const makeImmutable = function (val) {
  // Avoid infinite recursions
  const isFrozen = Object.isFrozen(val);
  if (isFrozen) { return val; }

  Object.freeze(val);

  freezeChildren(val);
};

// Non-plain objects must be directly mutated
const freezeChildren = function (obj) {
  if (obj === null || typeof obj !== 'object') { return; }

  // eslint-disable-next-line fp/no-loops
  for (const val of Object.values(obj)) {
    makeImmutable(val);
  }
};

module.exports = {
  makeImmutable,
};
