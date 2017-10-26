'use strict';

const { recurseMap } = require('../../../utilities');
const { throwError } = require('../../../error');
const { evalFilter } = require('../../../database');

// Merge `model.authorize` to `args.filter`
// If it can be already guessed that the model is not authorized, throw
// directly
const addAuthorizeFilter = function ({ modelName, authorize, vars, filter }) {
  // Evaluate `model.authorize` filter to a boolean
  // Do a partial evaluation, because we do not know the value of `$model.*` yet
  const authorizeA = evalFilter({
    filter: authorize,
    attrs: vars,
    partialNames: PARTIAL_NAMES_REGEXP,
  });

  checkAuthorize({ modelName, authorize: authorizeA });

  const filterA = getFilter({ authorize: authorizeA, filter });
  return filterA;
};

// `$model.*` is transformed to `authorize`, which is added to
// `args.filter` and checked against `args.data`
const PARTIAL_NAMES_REGEXP = /\$model\./;

// Throw error if authorization filter evaluated to false.
const checkAuthorize = function ({ modelName, authorize }) {
  if (authorize !== false) { return; }

  const message = `Accessing those '${modelName}' models is not allowed`;
  throwError(message, { reason: 'AUTHORIZATION' });
};

// Merge `authorizeFilter` to `args.filter`
const getFilter = function ({ authorize, filter }) {
  if (authorize === true) { return filter; }

  const authorizeA = recurseMap(authorize, removePrefix);

  // If no `args.filter`, no need to merge
  if (filter === undefined) { return authorizeA; }

  return { type: 'and', value: [authorizeA, filter] };
};

// Remove `$model.` prefix in AST's `attrName`
const removePrefix = function (value, name) {
  if (name !== 'attrName') { return value; }

  return value.replace(PARTIAL_NAMES_REGEXP, '');
};

module.exports = {
  addAuthorizeFilter,
};
