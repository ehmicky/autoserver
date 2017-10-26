'use strict';

const { throwError } = require('../../../error');
const { evalFilter } = require('../../../database');

// Handle all `model.authorize`:
//  - throw error if action is not authorized
//  - add `action.authorizationFilter` is authorization cannot be fully known
//    yet
const handleAuthorizeFilters = function ({ actions, ...rest }) {
  return actions.map(action => handleAuthorizeFilter({ action, ...rest }));
};

const handleAuthorizeFilter = function ({
  action,
  action: { modelName },
  authorizeMap,
  userVars,
  systemVars,
}) {
  const authorizeFilter = authorizeMap[modelName];

  const authorizeFilterA = evalAuthorizeFilter({
    action,
    authorizeFilter,
    userVars,
    systemVars,
  });

  checkAuthorizeFilter({ modelName, authorizeFilter: authorizeFilterA });

  const actionA = addAuthorizeFilter({
    action,
    authorizeFilter: authorizeFilterA,
  });
  return actionA;
};

// Evaluate `model.authorize` filter to a boolean
const evalAuthorizeFilter = function ({
  action,
  authorizeFilter,
  userVars,
  systemVars,
}) {
  const attrs = getFilterAttrs({ action, userVars, systemVars });
  // Do a partial evaluation, because we do not know the value of `$model.*`
  const authorizeFilterA = evalFilter({
    filter: authorizeFilter,
    attrs,
    partialNames: PARTIAL_NAMES_REGEXP,
  });
  return authorizeFilterA;
};

// Retrieve input of `model.authorize` filter
const getFilterAttrs = function ({
  action: { modelName, command },
  userVars,
  systemVars,
}) {
  return {
    ...userVars,
    ...systemVars,
    // Each action has its own values for the following system variables
    $command: command.type,
    $modelName: modelName,
  };
};

// `$model.*` is transformed to `authorizeFilter`, which is added to
// `args.filter` and checked against `args.data`
const PARTIAL_NAMES_REGEXP = /\$model\./;

// Throw error if authorization filter evaluated to false.
const checkAuthorizeFilter = function ({ modelName, authorizeFilter }) {
  if (authorizeFilter !== false) { return; }

  const message = `Accessing model '${modelName}' is not allowed`;
  throwError(message, { reason: 'AUTHORIZATION' });
};

// Add `action.authorizeFilter` if there is partial filter left
const addAuthorizeFilter = function ({ action, authorizeFilter }) {
  if (authorizeFilter === true) { return action; }

  return { ...action, authorizeFilter };
};

module.exports = {
  handleAuthorizeFilters,
};
