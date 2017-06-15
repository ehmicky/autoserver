'use strict';


const { ENV } = require('../env');


// Deeply Object.freeze() over an object.
const _makeImmutable = function (obj) {
  const isObject = obj && obj.constructor === Object;
  if (!isObject) { return obj; }

  // Avoid infinite recursions
  const isFrozen = Object.isFrozen(obj);
  if (isFrozen) { return; }

  Object.freeze(obj);

  for (const child of Object.values(obj)) {
    _makeImmutable(child);
  }
};
// Not in production, because Object.freeze() can be slow.
const makeImmutable = ENV === 'dev' ? _makeImmutable : val => val;


module.exports = {
  makeImmutable,
};
