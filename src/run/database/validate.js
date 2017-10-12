'use strict';

const { toSentence } = require('underscore.string');

const { assignArray } = require('../../utilities');
const { throwError } = require('../../error');
const { KINDS } = require('../../constants');

const { kindRegExp } = require('./kind_regexp');

// Validate `runOpts.db` options
const validateDbOpts = function ({ adapters, schema }) {
  // Merge all `runOpts.db.models`
  const allModels = adapters
    .map(({ models }) => models)
    .reduce(assignArray, []);

  adapters.forEach(({ models, kinds, type }) => validateModels({
    models,
    allModels,
    schema,
    kinds,
    type,
  }));
};

// Validate `runOpts.db.models` option
const validateModels = function ({ models, ...rest }) {
  models.forEach(model => validateModel({ model, ...rest }));
};

const validateModel = function ({ model, allModels, schema, kinds, type }) {
  validateDuplicateModel({ model, allModels, type });

  const [, kind] = kindRegExp.exec(model) || [];

  if (kind) {
    return validateKind({ kind, kinds, type });
  }

  validateModelName({ modelName: model, schema, kinds, type });
};

const validateDuplicateModel = function ({ model, allModels, type }) {
  const duplicates = allModels.filter(allModel => allModel === model);

  if (duplicates.length !== 1) {
    const message = `Invalid option 'db.${type}.models'. It contains '${model}' but this value is already used by another database option. Each model is only using a single database`;
    throwError(message, { reason: 'CONF_VALIDATION' });
  }
};

const validateKind = function ({ kind, kinds, type }) {
  const isValidKind = KINDS.includes(kind);

  if (!isValidKind) {
    const KINDSA = KINDS.map(KIND => `'kind:${KIND}'`);
    const KINDSB = toSentence(KINDSA, ', ', ' or ');
    const message = `Invalid option 'db.${type}.models'. It contains 'kind:${kind}' but this kind does not exist. Possible values: ${KINDSB}`;
    throwError(message, { reason: 'CONF_VALIDATION' });
  }

  const isValidAdapterKind = kinds.includes(kind);

  if (!isValidAdapterKind) {
    const message = `Invalid option 'db.${type}.models'. It contains 'kind:${kind}' but this kind is not supported by the '${type}' database.`;
    throwError(message, { reason: 'CONF_VALIDATION' });
  }
};

const validateModelName = function ({
  modelName,
  schema: { models: schemaModels },
  kinds,
  type,
}) {
  const schemaModel = Object.entries(schemaModels)
    .find(([name]) => modelName === name);

  if (schemaModel === undefined) {
    const validModelsA = Object.keys(schemaModels)
      .map(validModel => `'${validModel}'`);
    const validModelsB = toSentence(validModelsA, ', ', ' or ');
    const message = `Invalid option 'db.${type}.models'. It contains '${modelName}' but this model does not exist. Possible values: ${validModelsB}`;
    throwError(message, { reason: 'CONF_VALIDATION' });
  }

  const missingKind = schemaModel[1].kind
    .find(kindA => !kinds.includes(kindA));

  if (missingKind !== undefined) {
    const message = `Invalid option 'db.${type}.models'. It contains '${modelName}' but this model uses the '${missingKind}' kind, which is not supported by the '${type}' database.`;
    throwError(message, { reason: 'CONF_VALIDATION' });
  }
};

// If a `runOpts.db` is unused, it might indicate a configuration issue
const validateUnusedAdapters = function ({ adapters, adaptersMap }) {
  const usedAdapters = Object.values(adaptersMap);
  const specifiedAdapters = adapters.map(({ type }) => type);

  const unusedAdapter = specifiedAdapters
    .find(adapter => !usedAdapters.includes(adapter));
  if (unusedAdapter === undefined) { return; }

  const message = `Invalid option 'db.${unusedAdapter}': this database is not used by any model`;
  throwError(message, { reason: 'CONF_VALIDATION' });
};

module.exports = {
  validateDbOpts,
  validateUnusedAdapters,
};
