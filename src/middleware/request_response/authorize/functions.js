'use strict';

const { runConfigFunc, getVars } = require('../../../functions');
const {
  validateFilter,
  getAuthorizeAttrs,
  mapNodes,
} = require('../../../filter');

const { getServerVars } = require('./server_vars');

// Handle all config function related logic in `coll.authorize`
const handleConfigFuncs = function ({
  collname,
  authorize,
  serverVars,
  config,
  mInput,
}) {
  const authorizeA = resolveConfigFuncs({ authorize, mInput });

  validateAuthorize({ collname, authorize: authorizeA, config });

  const vars = getAllVars({ authorize: authorizeA, serverVars, mInput });

  return { authorize: authorizeA, vars };
};

// Resolve all config functions in `coll.authorize` so all leaves values
// are constants
const resolveConfigFuncs = function ({ authorize, mInput }) {
  return mapNodes(
    authorize,
    node => resolveConfigFunc({ mInput, node }),
  );
};

const resolveConfigFunc = function ({ mInput, node: { value, ...node } }) {
  const valueA = runConfigFunc({ configFunc: value, mInput });
  return { ...node, value: valueA };
};

// Most `coll.authorize` validation is done startup time
// But config functions are evaluated runtime. Their validation is
// skipped startup time, and they are validated here once evaluated.
const validateAuthorize = function ({ collname, authorize, config }) {
  const prefix = collname === undefined
    ? 'In \'config.authorize\', '
    : `In 'collection.${collname}.authorize', `;
  const reason = 'CONF_VALIDATION';

  const attrs = getAuthorizeAttrs({ config, collname });
  validateFilter({ filter: authorize, prefix, reason, attrs });
};

const getAllVars = function ({ authorize, serverVars, mInput }) {
  const serverVarsA = getServerVars({ authorize, serverVars, mInput });
  const systemVars = getVars(mInput);

  return { ...serverVarsA, ...systemVars };
};

module.exports = {
  handleConfigFuncs,
};
