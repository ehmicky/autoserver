'use strict';

const REF_SYM = Symbol('ref');

// Remember original JSON reference absolute path so it can be used later,
// for example to serialize back
// We need to directly mutate so functions remain functions
// and also to handle recursion
const setRef = function (obj, ref) {
  if (obj == null || typeof obj !== 'object') { return; }

  // eslint-disable-next-line no-param-reassign, fp/no-mutation
  obj[REF_SYM] = ref;
};

const getRef = function (obj) {
  return obj[REF_SYM];
};

module.exports = {
  setRef,
  getRef,
};
