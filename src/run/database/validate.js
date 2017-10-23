'use strict';

const { getWordsList } = require('../../utilities');
const { throwError } = require('../../error');

// Validate `runOpts.db` options
const validateDbOpts = function ({ adapters, schema }) {
  validateRequiredModels({ adapters });

  const validModels = [...Object.keys(schema.models), '...'];
  adapters.forEach(({ models, name }) =>
    validateModels({ models, name, validModels }));
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
  const [{ models, name }] = adapters;

  if (models === undefined) { return; }

  const message = `Invalid option 'db.${name}.models': it must not be defined when there is only one database`;
  throwError(message, { reason: 'CONF_VALIDATION' });
};

// `runOpts.db.DATABASE.models` must be defined if there are several databases
const validateHasModels = function ({ adapters }) {
  const adaptersA = adapters.filter(({ models }) => models === undefined);

  if (adaptersA.length === 0) { return; }

  const names = adaptersA.map(({ name }) => `db.${name}.models`);
  const namesA = getWordsList(names, { op: 'and', quotes: true });
  const message = `Invalid options ${namesA}: it must be defined`;
  throwError(message, { reason: 'CONF_VALIDATION' });
};

// Validate `runOpts.db.models` option
const validateModels = function ({ models, name, validModels }) {
  if (models === undefined) { return; }

  models.forEach(model => validateModelName({ model, name, validModels }));
};

const validateModelName = function ({ model, validModels, name }) {
  if (validModels.includes(model)) { return; }

  const validModelsA = getWordsList(validModels, { quotes: true });
  const message = `Invalid option 'db.${name}.models'. It contains '${model}' but this model does not exist. Possible values: ${validModelsA}`;
  throwError(message, { reason: 'CONF_VALIDATION' });
};

module.exports = {
  validateDbOpts,
};
