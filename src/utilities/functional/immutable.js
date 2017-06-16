'use strict';


const { ENV } = require('../env');


// Deeply Object.freeze() over an object.
const _makeImmutable = function (obj) {
  const isObjectOrArray = obj &&
    (obj.constructor === Object || obj instanceof Array);
  if (!isObjectOrArray) { return obj; }

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
