'use strict';

const { ENV } = require('../env');

const { mapValues } = require('./map');

// Deeply Object.freeze() over an object.
const deepFreeze = function (obj) {
  const isArray = Array.isArray(obj);
  const isObject = !isArray && obj && obj.constructor === Object;
  if (!isArray && !isObject) { return obj; }

  // Avoid infinite recursions
  const isFrozen = Object.isFrozen(obj);
  if (isFrozen) { return obj; }

  Object.freeze(obj);

  return freezeChildren(obj);
};

const freezeChildren = function (obj) {
  if (Array.isArray(obj)) {
    return obj.map(child => deepFreeze(child));
  }

  return mapValues(obj, child => deepFreeze(child));
};

// Not in production, because Object.freeze() can be slow.
const makeImmutable = ENV === 'dev' ? deepFreeze : val => val;

module.exports = {
  makeImmutable,
};
