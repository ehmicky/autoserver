'use strict';


const { map } = require('../../utilities');


// Normalize idl.helpers
const normalizeHelpers = function ({ idl }) {
  let { helpers = {} } = idl;

  if (helpers instanceof Array) {
    helpers = Object.assign({}, ...helpers);
  }
  // Helpers can either be an options object, or options.value directly
  helpers = map(helpers, helper => {
    return helper.value !== undefined ? helper : { value: helper };
  });

  const exposeMap = getExposeMap({ helpers });

  Object.assign(idl, { helpers, exposeMap });

  return idl;
};

// Possible values of helpers.HELPER.exposeTo
const exposeVars = ['filter', 'data'];

// Extract idl.helpers.HELPER.exposeTo ['filter', ...] to
// idl.exposeMap { filter: ['HELPER', ...] }
const getExposeMap = function ({ helpers }) {
  return exposeVars.reduce((memo, exposeVar) => {
    const matchingHelpers = Object.entries(helpers)
      .reduce((allHelpers, [helper, { exposeTo = [] }]) => {
        return exposeTo.includes(exposeVar)
          ? [...allHelpers, helper]
          : allHelpers;
      }, []);
    return Object.assign(memo, { [exposeVar]: matchingHelpers });
  }, {});
};


module.exports = {
  normalizeHelpers,
};
