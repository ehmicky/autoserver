'use strict';

const { mapValues, pickBy } = require('../../utilities');

// Normalize idl.helpers
const normalizeHelpers = function ({ idl, idl: { helpers = {} } }) {
  const flatHelpers = flattenHelpers({ helpers });
  const normalizedHelpers = normalizeSyntax({ helpers: flatHelpers });
  const exposedHelpers = getExposedHelpers({ helpers: normalizedHelpers });

  return { ...idl, helpers: normalizedHelpers, exposedHelpers };
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

// Extract idl.helpers.HELPER.exposed ['filter', ...] to
// idl.exposedHelpers ['HELPER', ...]
const getExposedHelpers = function ({ helpers }) {
  const exposedHelpers = pickBy(helpers, ({ exposed }) => exposed);
  return Object.keys(exposedHelpers);
};

module.exports = {
  normalizeHelpers,
};
