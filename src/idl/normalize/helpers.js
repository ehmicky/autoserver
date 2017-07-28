'use strict';

const { mapValues, assignObject, pickBy } = require('../../utilities');

// Normalize idl.helpers
const normalizeHelpers = function ({ idl, idl: { helpers = {} } }) {
  const flatHelpers = flattenHelpers({ helpers });
  const normalizedHelpers = normalizeSyntax({ helpers: flatHelpers });
  const exposeMap = getExposeMap({ helpers: normalizedHelpers });

  return { ...idl, helpers: normalizedHelpers, exposeMap };
};

// Helpers can be an array of objects, to help importing libraries using
// JSON references
const flattenHelpers = function ({ helpers }) {
  if (Array.isArray(helpers)) {
    return Object.assign({}, ...helpers);
  }

  return helpers;
};

// Helpers can either be an options object, or options.value directly
const normalizeSyntax = function ({ helpers }) {
  return mapValues(helpers, helper => {
    if (helper.value === undefined) { return { value: helper }; }
    return helper;
  });
};

// Extract idl.helpers.HELPER.exposeTo ['filter', ...] to
// idl.exposeMap { filter: ['HELPER', ...] }
const getExposeMap = function ({ helpers }) {
  return exposeVars
    .map(exposeVar => {
      const matchingHelpers = pickBy(helpers, ({ exposeTo }) =>
        exposeTo && exposeTo.includes(exposeVar)
      );
      const matchingHelpersKeys = Object.keys(matchingHelpers);
      return { [exposeVar]: matchingHelpersKeys };
    })
    .reduce(assignObject, {});
};

// Possible values of helpers.HELPER.exposeTo
const exposeVars = ['filter', 'data'];

module.exports = {
  normalizeHelpers,
};
