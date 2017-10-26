'use strict';

const { recurseMap } = require('../../../utilities');
const { throwCommonError } = require('../../../error');
const { evalFilter } = require('../../../database');

// Evaluate `model.authorize` filter to a boolean
// Do a partial evaluation, because we do not know the value of `$model.*` yet
// Returns partial filter if any.
const evalAuthorize = function ({ modelName, authorize, top, vars }) {
  const authorizeA = evalFilter({
    filter: authorize,
    attrs: vars,
    partialNames: PARTIAL_NAMES_REGEXP,
  });

  checkAuthorize({ modelName, authorize: authorizeA, top });

  if (authorizeA === true) { return authorizeA; }

  const authorizeB = recurseMap(authorizeA, removePrefix);
  return authorizeB;
};

// Throw error if authorization filter evaluated to false.
const checkAuthorize = function ({ modelName, authorize, top }) {
  if (authorize !== false) { return; }

  throwCommonError({ reason: 'AUTHORIZATION', modelName, top });
};

// Remove `$model.` prefix in AST's `attrName`
const removePrefix = function (value, name) {
  if (name !== 'attrName') { return value; }

  return value.replace(PARTIAL_NAMES_REGEXP, '');
};

// `$model.*` is transformed to `authorize`, which is added to
// `args.filter` and checked against `args.data`
const PARTIAL_NAMES_REGEXP = /\$model\./;

module.exports = {
  evalAuthorize,
};
