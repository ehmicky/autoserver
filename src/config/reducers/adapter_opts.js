'use strict';

const { throwError, addGenErrorHandler } = require('../../errors');
const { compile, validate } = require('../../validation');

// Validates `database.DATABASE.*`, `protocols.PROTOCOL.*` and `log.LOG.*`
const validateAdaptersOpts = function ({ opts, adaptersOpts, key }) {
  Object.entries(opts).forEach(([name, optsA]) =>
    validateAdapterOpts({ name, opts: optsA, adaptersOpts, key }));
};

const validateAdapterOpts = function ({ name, opts, adaptersOpts, key }) {
  const jsonSchema = getAdapterOpts({ name, adaptersOpts, key });
  const compiledJsonSchema = compile({ jsonSchema });

  eValidate({ compiledJsonSchema, data: opts, key, name });
};

const getAdapterOpts = function ({ name, adaptersOpts, key }) {
  const adapterOpts = adaptersOpts[name];
  if (adapterOpts !== undefined) { return adapterOpts; }

  const message = `'${key}.${name}' is unknown`;
  throwError(message, { reason: 'CONFIG_VALIDATION' });
};

const eValidate = addGenErrorHandler(validate, {
  reason: 'CONFIG_VALIDATION',
  message: ({ key, name }, { message }) =>
    `Wrong configuration: in '${key}.${name}', ${message}`,
});

module.exports = {
  validateAdaptersOpts,
};
