'use strict';

const { throwError } = require('../../errors');
const { compile, validate } = require('../../validation');

// Validates `database.DATABASE.*` and `protocols.PROTOCOL.*`
const validateAdaptersOpts = function ({ opts, adapters, key }) {
  Object.entries(opts).forEach(([name, optsA]) =>
    validateAdapterOpts({ name, opts: optsA, adapters, key }));
};

const validateAdapterOpts = function ({ name, opts, adapters, key }) {
  const { opts: jsonSchema = true } = getOptsAdapter({ name, adapters, key });
  const compiledJsonSchema = compile({ jsonSchema });

  validate({
    compiledJsonSchema,
    data: opts,
    dataVar: `${key}.${name}`,
    reason: 'CONF_VALIDATION',
    message: 'Wrong configuration',
  });
};

const getOptsAdapter = function ({ name, adapters, key }) {
  const adapter = adapters[name];
  if (adapter !== undefined) { return adapter; }

  const message = `'${key}.${name}' is unknown`;
  throwError(message, { reason: 'CONF_VALIDATION' });
};

module.exports = {
  validateAdaptersOpts,
};
