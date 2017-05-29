'use strict';


const { JslHelper } = require('./helpers');


// Retrieve parameters to use for a given JSL execution,
// after filtering and helpers binding
const getParams = function ({ params, type, exposeMap }) {
  const usedParams = filterParams({ params, type, exposeMap });

  bindHelpers({ params: usedParams });

  return usedParams;
};

// Restrict which JSL parameters are available for arg.filter|data
const filterParams = function ({ params, type, exposeMap }) {
  if (!restrictedTypes.includes(type)) { return params; }

  const exposedParams = [...alwaysExposed, ...exposeMap[type]];
  const filteredParams = Object.entries(params)
    .filter(([name]) => exposedParams.includes(name))
    .reduce((memo, [name, param]) => {
      return Object.assign(memo, { [name]: param });
    }, {});
  return filteredParams;
};

// Pass JSL parameters to helpers by assigning to their context (`this`)
// I.e. helpers have same parameters as their caller
const bindHelpers = function ({ params }) {
  const helperContext = { params };
  for (const [name, helper] of Object.entries(params)) {
    if (helper instanceof JslHelper) {
      // Note that `bind()` clones the function, i.e. there will be no
      // side-effects in case of concurrent async JSL calls
      params[name] = params[name].bind(helperContext);
    }
  }
};

// Those JSL execution types restrict which JSL parameters are available
const restrictedTypes = ['filter', 'data'];
// Those JSL parameters are always exposed
const alwaysExposed = ['$', '$$'];


module.exports = {
  getParams,
};
