'use strict';

const REF_SYM = Symbol('ref');

// Remember original JSON reference absolute path so it can be used later,
// for example to serialize back
const setRef = function (obj, ref) {
  // We need to directly mutate so functions remain functions
  if (obj != null && typeof obj === 'object') {
    // eslint-disable-next-line no-param-reassign, fp/no-mutation
    obj[REF_SYM] = ref;
  }

  return obj;
};

const getRef = function (obj) {
  return obj[REF_SYM];
};

module.exports = {
  setRef,
  getRef,
};
