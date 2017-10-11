'use strict';

const { databaseAdapters } = require('../../../database');
const { assignArray } = require('../../../utilities');
const { throwError } = require('../../../error');

// Retrieve database adapter-specific options
const getAdaptersOpts = function () {
  return Object.values(databaseAdapters)
    .map(getAdapterOpts)
    .reduce(assignArray, []);
};

// Reuse `databaseAdapter.opts`, and automatically adds some properties
const getAdapterOpts = function ({ type, title, description, opts }) {
  opts.forEach(opt => validateAdapterOpt({ opt, type }));

  // Add `databaseAdapter.description`
  const mainOptA = { ...mainOpt, description };
  return [mainOptA, ...commonOpts, ...opts]
    // Add `databaseAdapter.title` to option group
    .map(opt => ({ ...opt, group: `Databases (${title})` }))
    .map(({ name: optName, ...opt }) => ({
      name: getAdapterName({ optName, type }),
      ...opt,
    }));
};

const validateAdapterOpt = function ({ opt: { name }, type }) {
  const commonOpt = commonOpts.find(({ name: nameA }) => nameA === name);
  if (commonOpt === undefined) { return; }

  const message = `Database adapter '${type}' cannot specify an option named '${commonOpt.name}' because it is already a common option`;
  throwError(message, { reason: 'UTILITY_ERROR' });
};

// Main database adapter option.
// `databaseAdapter.description` is automatically added.
const mainOpt = {
  name: '',
  validate: {
    type: 'object',
  },
};

// Options shared by all database adapters
const commonOpts = [
  {
    name: 'models',
    description: 'Models using this database.\nCan either be the \'model\' name or the models kind as \'kind:...\'',
    validate: {
      type: 'string[]',
    },
  },
];

// Prepend `db.TYPE.` to options
const getAdapterName = function ({ optName, type }) {
  return optName === ''
    ? `db.${type}`
    : `db.${type}.${optName}`;
};

module.exports = {
  getAdaptersOpts,
};
