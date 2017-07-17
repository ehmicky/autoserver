'use strict';

const { ENV } = require('../env');

// Deeply Object.freeze() over an object.
const deepFreeze = function (obj) {
  const isObjectOrArray = obj &&
    (obj.constructor === Object || Array.isArray(obj));
  if (!isObjectOrArray) { return obj; }

  // Avoid infinite recursions
  const isFrozen = Object.isFrozen(obj);
  if (isFrozen) { return; }

  Object.freeze(obj);

  for (const child of Object.values(obj)) {
    deepFreeze(child);
  }
};

// Not in production, because Object.freeze() can be slow.
const makeImmutable = ENV === 'dev' ? deepFreeze : val => val;

module.exports = {
  makeImmutable,
};
