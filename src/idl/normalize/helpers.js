'use strict';

const { mapValues, assignObject, assignArray } = require('../../utilities');

// Normalize idl.helpers
const normalizeHelpers = function ({ idl }) {
  let { helpers = {} } = idl;

  if (Array.isArray(helpers)) {
    helpers = Object.assign({}, ...helpers);
  }

  // Helpers can either be an options object, or options.value directly
  helpers = mapValues(helpers, helper => helper.value !== undefined ? helper : { value: helper });

  const exposeMap = getExposeMap({ helpers });

  Object.assign(idl, { helpers, exposeMap });

  return idl;
};

// Possible values of helpers.HELPER.exposeTo
const exposeVars = ['filter', 'data'];

// Extract idl.helpers.HELPER.exposeTo ['filter', ...] to
// idl.exposeMap { filter: ['HELPER', ...] }
const getExposeMap = function ({ helpers }) {
  return exposeVars
    .map(exposeVar => {
      const matchingHelpers = Object.entries(helpers)
        .map(([helper, { exposeTo = [] }]) => exposeTo.includes(exposeVar) ? helper : [])
        .reduce(assignArray, []);
      return { [exposeVar]: matchingHelpers };
    })
    .reduce(assignObject, {});
};

module.exports = {
  normalizeHelpers,
};
