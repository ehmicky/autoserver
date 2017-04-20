'use strict';

/**
 * Summary of operations:
 *   findOne({ filter: { id } })
 *   findMany({ [filter], [order_by] })
 *   deleteOne({ filter: { id } })
 *   deleteMany({ [filter], [order_by] })
 *   updateOne({ data, filter: { id } })
 *   updateMany({ data, [filter], [order_by] })
 *   createOne({ data })
 *   createMany({ data[], [order_by] })
 *   replaceOne({ data })
 *   replaceMany({ data[], [order_by] })
 *   upsertOne({ data })
 *   upsertMany({ data[], [order_by] })
 *
 * Summary of arguments:
 *  - {object|object[]} data - Attributes to update or create
 *                             Is an array in createMany, replaceMany or upsertMany
 *                             `data.id` is required in upsert* and replace*, optional in create*, not allowed in update*
 *  - {any} filter           - Filter the operation by a specific attribute.
 *                             The argument name is that attribute name, not `filter`
 *                             `filter.id` is required in findOne, deleteOne and updateOne
 *                             `filter.id` is an array in findMany, deleteMany and updateMany
 *  - {string} [order_by]    - Sort results.
 *                             Value is attribute name, followed by optional + or - for ascending|descending order (default: +)
 *                             Can contain dots to select fields, e.g. order_by="furniture.size"
 *
 * Operations on submodels will automatically get filtered by id.
 * If an id is then specified, both filters will be used
 * For createOne:
 *   - it is the id the newly created instance
 *   - it is optional, unless there is another nested operation on a submodel
 **/


const { every, chain, uniq, orderBy, map, isEqual } = require('lodash');
const uuiv4 = require('uuid/v4');

const { EngineError } = require('../../error');


const createId = function () {
  return uuiv4();
};

const orderPostfixRegexp = /(.*)(\+|-)$/;
const sortResponse = function ({ response, orderByArg = 'id+' }) {
  if (!response || !(response instanceof Array)) { return response; }

  // Allow multiple attributes sorting
  const orders = orderByArg.split(',');

  const orderArgs = orders.map(order => {
    const args = { ascending: 'asc' };
    // Tries to parse the + or - postfix
    const orderTokens = orderPostfixRegexp.exec(order);
    if (orderTokens) {
      args.attribute = orderTokens[1];
      args.ascending = orderTokens[2] === '-' ? 'desc' : 'asc';
    } else {
      args.attribute = orderByArg;
    }
    return args;
  });

  const sortedResponse = orderBy(response, map(orderArgs, 'attribute'), map(orderArgs, 'ascending'));
  return sortedResponse;
};

const findOneIndex = function({ collection, id, required = true }) {
  const modelIndex = collection.findIndex(model => model.id === id);
  if (modelIndex === -1 && required) {
    throw new EngineError(`Could not find the model with id ${id} in: ${collection.modelName} (collection)`, {
      reason: 'DATABASE_NOT_FOUND',
    });
  }
  return modelIndex;
};

const findManyIndexes = function({ collection, filter = {} }) {
  if (filter.id) {
    const uniqueIds = uniq(filter.id);
    const indexes = uniqueIds.map(id => findOneIndex({ collection, id }));
    collection = collection.map((model, index) => indexes.includes(index) ? model : null);
    filter = Object.assign({}, filter);
    delete filter.id;
  }
  const modelIndexes = chain(collection)
    .map((model, index) => {
      if (!model) { return null; }
      const matches = matchesFilters({ filter, model });
      if (!matches) { return null; }
      return index;
    })
    .filter(index => index != null)
    .value();
  return modelIndexes;
};

// Check if a model matches a query filter
const matchesFilters = function ({ filter, model }) {
  const matches = every(filter, (filterVal, filterName) => {
    return isEqual(model[filterName], filterVal);
  });
  return matches;
};

const checkUniqueId = function ({ collection, id }) {
  const index = findOneIndex({ collection, id, required: false });
  if (index !== -1) {
    throw new EngineError(`Model with id ${id} already exists in: ${collection.modelName} (collection)`, {
      reason: 'DATABASE_MODEL_CONFLICT',
    });
  }
};

const findOne = function ({ collection, filter: { id } }) {
  const index = findOneIndex({ collection, id });
  return collection[index];
};

const findMany = function ({ collection, filter = {} }) {
  const indexes = findManyIndexes({ collection, filter });
  const models = indexes.map(index => collection[index]);
  return models;
};

const deleteOne = function ({ collection, filter: { id } }) {
  const index = findOneIndex({ collection, id });
  collection.splice(index, 1);
  return { id };
};

const deleteMany = function ({ collection, filter = {} }) {
  const indexes = findManyIndexes({ collection, filter });
  const removedIds = indexes.map(index => ({ id: collection[index].id }));
  indexes.sort();
  indexes.forEach((index, count) => {
    collection.splice(index - count, 1);
  });
  return removedIds;
};

const updateOne = function ({ collection, data, filter: { id } }) {
  const index = findOneIndex({ collection, id });
  const model = collection[index];
  const newModel = Object.assign({}, model, data);
  collection.splice(index, 1, newModel);
  return newModel;
};

const updateMany = function ({ collection, data, filter = {} }) {
  const indexes = findManyIndexes({ collection, filter });
  const newModels = indexes.map(index => {
    const model = collection[index];
    const newModel = Object.assign({}, model, data);
    collection.splice(index, 1, newModel);
    return newModel;
  });
  return newModels;
};

const createOne = function ({ collection, data }) {
  checkUniqueId({ collection, id: data.id });
  const id = data.id || createId();
  const newModel = Object.assign({}, data, { id });
  collection.push(newModel);
  return newModel;
};

const createMany = function ({ collection, data }) {
  return data.map(datum => createOne({ collection, data: datum }));
};

const replaceOne = function ({ collection, data }) {
  const index = findOneIndex({ collection, id: data.id });
  collection.splice(index, 1, data);
  return data;
};

const replaceMany = function ({ collection, data }) {
  return data.map(datum => replaceOne({ collection, data: datum }));
};

const upsertOne = function ({ collection, data }) {
  const index = findOneIndex({ collection, id: data.id, required: false });
  if (index === -1) {
    return createOne({ collection, data });
  } else {
    return replaceOne({ collection, data });
  }
};

const upsertMany = function ({ collection, data }) {
  return data.map(datum => upsertOne({ collection, data: datum }));
};

const operations = {
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

const fireOperation = function (opts) {
  const response = operations[opts.operation](opts);
  const sortedResponse = sortResponse({ response, orderByArg: opts.orderBy });
  return sortedResponse;
};

module.exports = {
  fireOperation,
};
