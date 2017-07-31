'use strict';

const { pickBy, mapValues, makeImmutable } = require('../../utilities');

// Retrieve parameters to use for a given JSL execution,
// after filtering and helpers binding
const getParams = function ({ params, type, idl }) {
  const paramsA = bindHelpers({ params, type, idl });
  const paramsB = filterParams({ params: paramsA, type, idl });
  const paramsC = makeImmutable(paramsB);

  return paramsC;
};

// Pass JSL parameters to helpers
// I.e. helpers have same parameters as their caller
const bindHelpers = function ({ params, type, idl }) {
  // Checking Func.length makes sure that binding won't happen twice
  // in case of recursive calls (helpers calling each other)
  const unboundHelpers = pickBy(params, helper =>
    typeof helper === 'function' && helper.length === 1
  );
  const boundHelpers = mapValues(unboundHelpers, helper =>
    helper.bind(null, { params, type, idl })
  );
  return { ...params, ...boundHelpers };
};

// Restrict which JSL parameters are available for args.filter|data
const filterParams = function ({ params, type, idl: { exposeMap } }) {
  if (!restrictedTypes.includes(type)) { return params; }

  const exposedParams = [...alwaysExposed, ...exposeMap[type]];
  const filteredParams = pickBy(params, (param, name) =>
    exposedParams.includes(name));
  return filteredParams;
};

// Those JSL execution types restrict which JSL parameters are available
const restrictedTypes = ['filter', 'data'];
// Those JSL parameters are always exposed
const alwaysExposed = ['$', '$$'];

module.exports = {
  getParams,
};
