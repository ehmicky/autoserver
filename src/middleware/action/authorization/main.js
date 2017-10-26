'use strict';

const { getVars } = require('../../../schema_func');

const { getAuthorizeMap } = require('./map');
const { getUserVars } = require('./user_vars');
const { handleAuthorizeFilters } = require('./filter');

// Handles `model.authorize`
const validateAuthorization = function ({ actions, schema, userVars, mInput }) {
  const authorizeMap = getAuthorizeMap({ actions, schema, mInput });
  const userVarsA = getUserVars({ authorizeMap, userVars, mInput });
  const systemVars = getVars(mInput);
  const actionsA = handleAuthorizeFilters({
    actions,
    authorizeMap,
    userVars: userVarsA,
    systemVars,
  });
  return { actions: actionsA };
};

module.exports = {
  validateAuthorization,
};
