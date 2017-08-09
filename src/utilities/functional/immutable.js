'use strict';

const { mapValues } = require('./map');

// Shallow Object.freeze()
const makeImmutableShallow = function (val) {
  if (!val || typeof val !== 'object') { return val; }

  Object.freeze(val);

  return val;
};

// Deeply Object.freeze() over an object.
// Since linting enforces immutability, we only need to (and should) perform
// this on values that are passed to library caller.
const makeImmutable = function (val) {
  const type = getType(val);
  if (type === 'other') { return val; }

  return deepFreeze(val, type);
};

const deepFreeze = function (val, type) {
  // Avoid infinite recursions
  const isFrozen = Object.isFrozen(val);
  if (isFrozen) { return val; }

  // Need to freeze to avoid infinite recursions
  Object.freeze(val);

  const freezeChildren = getFreezeChildren(type);
  const valA = freezeChildren(val);

  // Need to freeze again because children recursion created a new object
  return Object.freeze(valA);
};

const getType = function (val) {
  if (Array.isArray(val)) { return 'array'; }
  if (val && val.constructor === Object) { return 'plainObject'; }
  if (val && typeof val === 'object') { return 'object'; }
  return 'other';
};

const getFreezeChildren = function (type) {
  if (type === 'array') { return deepFreezeArray; }
  if (type === 'plainObject') { return deepFreezePlainObject; }
  if (type === 'object') { return deepFreezeObject; }
};

const deepFreezeArray = function (arr) {
  return arr.map(child => makeImmutable(child));
};

const deepFreezePlainObject = function (obj) {
  return mapValues(obj, child => makeImmutable(child));
};

// Non-plain objects must be directly mutated
const deepFreezeObject = function (obj) {
  // eslint-disable-next-line fp/no-loops
  for (const [, val] of Object.entries(obj)) {
    makeImmutable(val);
  }

  return obj;
};

module.exports = {
  makeImmutableShallow,
  makeImmutable,
};
