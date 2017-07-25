'use strict';

const { mapValues, assignObject, assignArray } = require('../../utilities');

// Normalize idl.helpers
const normalizeHelpers = function ({ idl }) {
  const helpers = getNormalizedHelpers({ idl });
  const exposeMap = getExposeMap({ helpers });

  return Object.assign({}, idl, { helpers, exposeMap });
};

const getNormalizedHelpers = function ({ idl }) {
  const helpers = getHelpers({ idl });

  // Helpers can either be an options object, or options.value directly
  return mapValues(helpers, helper =>
    (helper.value === undefined ? { value: helper } : helper)
  );
};

const getHelpers = function ({ idl: { helpers = {} } }) {
  if (Array.isArray(helpers)) {
    return Object.assign({}, ...helpers);
  }

  return helpers;
};

// Possible values of helpers.HELPER.exposeTo
const exposeVars = ['filter', 'data'];

// Extract idl.helpers.HELPER.exposeTo ['filter', ...] to
// idl.exposeMap { filter: ['HELPER', ...] }
const getExposeMap = function ({ helpers }) {
  return exposeVars
    .map(exposeVar => {
      const matchingHelpers = Object.entries(helpers)
        .map(([helper, { exposeTo = [] }]) =>
          (exposeTo.includes(exposeVar) ? helper : [])
        )
        .reduce(assignArray, []);
      return { [exposeVar]: matchingHelpers };
    })
    .reduce(assignObject, {});
};

module.exports = {
  normalizeHelpers,
};
