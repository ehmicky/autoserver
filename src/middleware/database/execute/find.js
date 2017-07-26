'use strict';

const { throwError } = require('../../../error');

const findIndexes = function ({ collection, nFilter, opts: { jsl, idl } }) {
  if (!nFilter) {
    return collection.map((model, index) => index);
  }

  const modelIndexes = Object.entries(collection)
    // Check if a model matches a query nFilter
    .filter(([, model]) => {
      // TODO: remove when using MongoDB query objects
      const params = { $$: model };
      return jsl.run({ value: nFilter, params, type: 'filter', idl });
    })
    .map(([index]) => index);
  return modelIndexes;
};

const findIndex = function ({
  collection,
  id,
  opts: { modelName, mustExist = true },
}) {
  const [index] = Object.entries(collection)
    .filter(([, { id: modelId }]) => modelId === id)
    .map(([modelIndex]) => modelIndex);

  if (!index && mustExist === true) {
    const message = `Could not find the model with id ${id} in: ${modelName} (collection)`;
    throwError(message, { reason: 'DATABASE_NOT_FOUND' });
  }

  if (index && mustExist === false) {
    const message = `Model with id ${id} already exists in: ${modelName} (collection)`;
    throwError(message, { reason: 'DATABASE_MODEL_CONFLICT' });
  }

  return index;
};

// '($ === ID)' -> ID
const filterToId = function ({ nFilter }) {
  try {
    const parts = idJslRegExp.exec(nFilter);

    if (!parts) {
      const message = `JSL expression should be '($ === ID)': ${nFilter}`;
      throwError(message, { reason: 'INPUT_SERVER_VALIDATION' });
    }

    const id = JSON.parse(parts[1]);
    return id;
  } catch (error) {
    const message = `JSL expression should be '($ === ID)': ${nFilter}`;
    throwError(message, {
      reason: 'INPUT_SERVER_VALIDATION',
      innererror: error,
    });
  }
};

// Look for '(($ === ID))'
const idJslRegExp = /^\(\(\$\$\.id\s*===\s*(.*)\)\)$/;

const findIndexByFilter = function ({ nFilter, collection, opts }) {
  const id = filterToId({ nFilter });
  const index = findIndex({ collection, id, opts });
  return index;
};

module.exports = {
  findIndexes,
  findIndex,
  findIndexByFilter,
};
