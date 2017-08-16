'use strict';

const { pickBy, mapValues, makeImmutable } = require('../../utilities');

// Retrieve parameters to use for a given JSL execution,
// after filtering and helpers binding
const getParams = function ({ params }) {
  const paramsA = bindHelpers({ params });
  const paramsC = makeImmutable(paramsA);

  return paramsC;
};

// Pass JSL parameters to helpers
// I.e. helpers have same parameters as their caller
const bindHelpers = function ({ params }) {
  // Checking Func.length makes sure that binding won't happen twice
  // in case of recursive calls (helpers calling each other)
  const unboundHelpers = pickBy(params, helper =>
    typeof helper === 'function' && helper.length === 1
  );
  const boundHelpers = mapValues(unboundHelpers, helper =>
    helper.bind(null, { params })
  );
  return { ...params, ...boundHelpers };
};

module.exports = {
  getParams,
};
