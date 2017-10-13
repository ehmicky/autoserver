'use strict';

const { getWordsList } = require('../../utilities');
const { throwError } = require('../../error');

// Validate `runOpts.db` options
const validateDbOpts = function ({ adapters, schema }) {
  validateRequiredModels({ adapters });

  const validModels = [...Object.keys(schema.models), '...'];
  adapters.forEach(({ models, type }) =>
    validateModels({ models, type, validModels }));
};

// Validate whether `runOpts.db.DATABASE.models` is undefined
const validateRequiredModels = function ({ adapters }) {
  if (adapters.length === 0) {
    const message = 'Invalid option \'db\': no database is defined';
    throwError(message, { reason: 'CONF_VALIDATION' });
  }

  if (adapters.length === 1) {
    return validateNoModels({ adapters });
  }

  validateHasModels({ adapters });
};

// `runOpts.db.DATABASE.models` must be undefined if there is only one database
const validateNoModels = function ({ adapters }) {
  const [{ models, type }] = adapters;

  if (models === undefined) { return; }

  const message = `Invalid option 'db.${type}.models': it must not be defined when there is only one database`;
  throwError(message, { reason: 'CONF_VALIDATION' });
};

// `runOpts.db.DATABASE.models` must be defined if there are several databases
const validateHasModels = function ({ adapters }) {
  const adaptersA = adapters.filter(({ models }) => models === undefined);

  if (adaptersA.length === 0) { return; }

  const types = adaptersA.map(({ type }) => `db.${type}.models`);
  const typesA = getWordsList(types, { op: 'and', quotes: true });
  const message = `Invalid options ${typesA}: it must be defined`;
  throwError(message, { reason: 'CONF_VALIDATION' });
};

// Validate `runOpts.db.models` option
const validateModels = function ({ models, type, validModels }) {
  if (models === undefined) { return; }

  models.forEach(model => validateModelName({ model, type, validModels }));
};

const validateModelName = function ({ model, validModels, type }) {
  if (validModels.includes(model)) { return; }

  const validModelsA = getWordsList(validModels, { quotes: true });
  const message = `Invalid option 'db.${type}.models'. It contains '${model}' but this model does not exist. Possible values: ${validModelsA}`;
  throwError(message, { reason: 'CONF_VALIDATION' });
};

module.exports = {
  validateDbOpts,
};
