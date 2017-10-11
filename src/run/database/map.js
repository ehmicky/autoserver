'use strict';

const { mapValues } = require('../../utilities');
const { throwError } = require('../../error');

const { kindRegExp } = require('./kind_regexp');

// Retrieve `{ model: 'database', ... }`
const getAdaptersMap = function ({ adapters, schemaModels }) {
  return mapValues(schemaModels, matchAdapter.bind(null, adapters));
};

// Try each `getter` in order, until one works
const matchAdapter = function (adapters, model, modelName) {
  const adapter = getters.reduce(
    findAdapter.bind(null, { adapters, model, modelName }),
    null,
  );

  // If none works, this means the model will fail
  if (adapter === undefined) {
    const message = `Invalid option 'db': model '${modelName}' does have any matching database`;
    throwError(message, { reason: 'CONF_VALIDATION' });
  }

  return adapter.type;
};

// Try the getter on each database adapter,
// in order (i.e. first ones have priority)
const findAdapter = function (
  { adapters, model, modelName },
  adapter,
  getter,
) {
  if (adapter != null) { return adapter; }

  return adapters
    .find(adapterA => getter({ adapter: adapterA, model, modelName }));
};

// Try to find a database using `db.models` 'model'
const getByModelName = function ({ adapter: { models }, modelName }) {
  return models.includes(modelName);
};

// Try to find a database using `db.models` 'kind:KIND'
const getByModelKind = function ({ adapter: { models }, model: { kind } }) {
  return models
    .map(model => (kindRegExp.exec(model) || [])[1])
    .filter(kindA => kindA !== undefined)
    .some(kindA => kind.includes(kindA));
};

// Try to find a database using database supported kinds
const getByAdapterKinds = function ({
  adapter: { kinds = [] },
  model: { kind },
}) {
  return kinds.some(kindA => kind.includes(kindA));
};

const getters = [
  getByModelName,
  getByModelKind,
  getByAdapterKinds,
];

module.exports = {
  getAdaptersMap,
};
