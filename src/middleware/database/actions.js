'use strict';

/**
 * Summary of actions:
 *   findOne({ filter: { id } })
 *   findMany({ [filter], [order_by] })
 *   deleteOne({ filter: { id }, [dry_run] })
 *   deleteMany({ [filter], [order_by], [dry_run] })
 *   updateOne({ data, filter: { id }, [dry_run] })
 *   updateMany({ data, [filter], [order_by], [dry_run] })
 *   createOne({ data, [dry_run] })
 *   createMany({ data[], [order_by], [dry_run] })
 *   replaceOne({ data, [dry_run] })
 *   replaceMany({ data[], [order_by], [dry_run] })
 *   upsertOne({ data, [dry_run] })
 *   upsertMany({ data[], [order_by], [dry_run] })
 *
 * Summary of arguments:
 *  - {object|object[]} data - Attributes to update or create
 *                             Is an array in createMany, replaceMany or upsertMany
 *                             `data.id` is required in upsert* and replace*, optional in create*, not allowed in update*
 *  - {any} filter           - Filter the action by a specific attribute.
 *                             The argument name is that attribute name, not `filter`
 *                             Can use JSL
 *                             `filter.id` is required and cannot use JSL in findOne, deleteOne and updateOne
 *  - {string} [order_by]    - Sort results.
 *                             Value is attribute name, followed by optional + or - for ascending|descending order (default: +)
 *                             Can contain dots to select fields, e.g. order_by="furniture.size"
 *  - {boolean} [dry_run]    - If true, the action will not modify the database, but the return value will be the same as if
 *                             it did.
 *
 * Actions on submodels will automatically get filtered by id.
 * If an id is then specified, both filters will be used
 * For createOne:
 *   - it is the id the newly created instance
 *   - it is optional, unless there is another nested action on a submodel
 **/


const { omit, cloneDeep, orderBy, map } = require('lodash');
const uuiv4 = require('uuid/v4');

const { EngineError } = require('../../error');
const { processJsl } = require('../../jsl');


const createId = function () {
  return uuiv4();
};

// order_by sorting
const sortResponse = function ({ data, orderByArg }) {
  if (!data || !(data instanceof Array)) { return data; }

  const sortedData = orderBy(data, map(orderByArg, 'attrName'), map(orderByArg, 'order'));
  return sortedData;
};

// Pagination limiting
const limitResponse = function ({ data, limit }) {
  if (limit === undefined) { return data; }
  return data.slice(0, limit);
};

// '($ === ID)' -> ID
const filterToId = function ({ filter: { jsl } }) {
  try {
    const parts = idJslRegExp.exec(jsl);
    if (!parts) {
      throw new EngineError(`JSL expression should be '($ === ID)': ${jsl}`, { reason: 'INPUT_SERVER_VALIDATION' });
    }
    const id = JSON.parse(parts[1]);
    return id;
  } catch (innererror) {
    throw new EngineError(`JSL expression should be '($ === ID)': ${jsl}`, { reason: 'INPUT_SERVER_VALIDATION', innererror });
  }
};
// Look for '($ === ID)'
const idJslRegExp = /^\(\$\$\.id\s*===\s*(.*)\)$/;

const findIndexes = function({ collection, filter, opts: { jslInput } }) {
  if (!filter) {
    return collection.map((model, index) => index);
  }

  const modelIndexes = Object.entries(collection)
    // Check if a model matches a query filter
    .filter(([/*index*/, model]) => {
      // TODO: remove when using MongoDB query objects
      try {
        const modelInput = { parent: model, model };
        return processJsl(Object.assign({ jsl: filter }, jslInput, { modelInput }));
      } catch (innererror) {
        throw new EngineError(`JSL expression used as filter failed: ${filter.jsl}`, {
          reason: 'INPUT_VALIDATION',
          innererror,
        });
      }
    })
    .map(([index]) => index);
  return modelIndexes;
};

const findIndex = function ({ collection, id, opts: { modelName, mustExist = true } }) {
  const index = Object.entries(collection)
    .filter(([,{ id: modelId }]) => modelId === id)
    .map(([index]) => index)[0];
  if (!index && mustExist === true) {
    throw new EngineError(`Could not find the model with id ${id} in: ${modelName} (collection)`, {
      reason: 'DATABASE_NOT_FOUND',
    });
  }
  if (index && mustExist === false) {
    throw new EngineError(`Model with id ${id} already exists in: ${modelName} (collection)`, {
      reason: 'DATABASE_MODEL_CONFLICT',
    });
  }
  return index;
};

// attributes with writeOnce true are not updated, unless undefined
const getOmitKeys = function ({ model, writeOnceAttributes }) {
  return Object.keys(model)
    .filter(key => writeOnceAttributes.includes(key))
    .filter(key => model[key] !== undefined);
};

const findOne = function ({ collection, filter, opts }) {
  const id = filterToId({ filter });
  const index = findIndex({ collection, id, opts });
  return { data: collection[index] };
};

const findMany = function ({ collection, filter, opts }) {
  const indexes = findIndexes({ collection, filter, opts });
  const models = indexes.map(index => collection[index]);
  return { data: models };
};

const deleteOne = function ({ collection, filter, opts }) {
  const { dryRun } = opts;
  const id = filterToId({ filter });
  const index = findIndex({ collection, id, opts });
  const model = dryRun ? collection[index] : collection.splice(index, 1)[0];
  return { data: model };
};

const deleteMany = function ({ collection, filter, opts }) {
  const { dryRun } = opts;
  const indexes = findIndexes({ collection, filter, opts }).sort();
  const models = indexes.map((index, count) => {
    const model = dryRun ? collection[index] : collection.splice(index - count, 1)[0];
    return model;
  });
  return { data: models };
};

const update = function ({ collection, index, data, opts }) {
  const { writeOnceAttributes, dryRun } = opts;
  const model = collection[index];
  const omitKeys = getOmitKeys({ model, writeOnceAttributes });
  const newModel = Object.assign({}, model, omit(data, omitKeys));
  if (!dryRun) {
    collection.splice(index, 1, newModel);
  }
  return newModel;
};

const updateOne = function ({ collection, data, filter, opts }) {
  const id = filterToId({ filter });
  const index = findIndex({ collection, id, opts });
  const newModel = update({ collection, index, data, opts });
  return { data: newModel };
};

const updateMany = function ({ collection, data, filter, opts }) {
  const indexes = findIndexes({ collection, filter, opts });
  const newModels = indexes.map(index => update({ collection, index, data, opts }));
  return { data: newModels };
};

const create = function ({ collection, data, opts }) {
  const { dryRun } = opts;
  let id = data.id;
  if (id) {
    findIndex({ collection, id, opts: Object.assign({}, opts, { mustExist: false }) });
  } else {
    id = createId();
  }

  const newModel = Object.assign({}, data, { id });
  if (!dryRun) {
    collection.push(newModel);
  }
  return newModel;
};

const createOne = function ({ collection, data, opts }) {
  const newModel = create({ collection, data, opts });
  return { data: newModel };
};

const createMany = function ({ collection, data, opts }) {
  const newModels = data.map(datum => create({ collection, data: datum, opts }));
  return { data: newModels };
};

const replace = function ({ collection, data, opts }) {
  const { writeOnceAttributes, dryRun } = opts;
  const index = findIndex({ collection, id: data.id, opts });

  const model = collection[index];
  const omitKeys = getOmitKeys({ model, writeOnceAttributes });
  const newModel = Object.assign({}, model, omit(data, omitKeys));
  if (!dryRun) {
    collection.splice(index, 1, newModel);
  }

  return newModel;
};

const replaceOne = function ({ collection, data, opts }) {
  const newModel = replace({ collection, data, opts });
  return { data: newModel };
};

const replaceMany = function ({ collection, data, opts }) {
  const newModels = data.map(datum => replace({ collection, data: datum, opts }));
  return { data: newModels };
};

const upsertOne = function ({ collection, data, opts }) {
  const index = findIndex({ collection, id: data.id, opts: Object.assign({}, opts, { mustExist: null }) });
  if (index) {
    return replaceOne({ collection, data, opts });
  } else {
    return createOne({ collection, data, opts });
  }
};

const upsertMany = function ({ collection, data, opts }) {
  const models = data.map(datum => upsertOne({ collection, data: datum, opts }).data);
  return { data: models };
};

const actions = {
  findOne,
  findMany,
  deleteOne,
  deleteMany,
  updateOne,
  updateMany,
  createOne,
  createMany,
  replaceOne,
  replaceMany,
  upsertOne,
  upsertMany,
};

const fireAction = function (opts) {
  const { action, opts: { orderBy, limit } } = opts;
  const response = actions[action](opts);
  response.data = sortResponse({ data: response.data, orderByArg: orderBy });
  response.data = limitResponse({ data: response.data, limit });
  if (response.metadata === undefined) {
    response.metadata = response.data instanceof Array ? Array(response.data.length).fill({}) : {};
  }

  // TODO: Only necessary as long as we do not use real database, to make sure it is not modified
  const copiedResponse = cloneDeep(response);

  return copiedResponse;
};

module.exports = {
  fireAction,
};
