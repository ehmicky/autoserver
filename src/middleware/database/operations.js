'use strict';

/**
 * Summary of operations:
 *   findOne(id)
 *   findMany([ids|filter...])
 *   deleteOne(id)
 *   deleteMany(ids|filter...)
 *   updateOne(data, id)
 *   updateMany(data[, ids|filter...])
 *   createOne(data[, id])
 *   createMany(data[][, ids])
 *   replaceOne(data, id)
 *   replaceMany(data[], ids)
 *   upsertOne(data, id)
 *   upsertMany(data[], ids)
 *
 * Summary of arguments:
 *  - {any|any[]} id|ids     - Filter the operation by id
 *                             For createOne:
 *                              - it is the id the newly created instance
 *                              - it is optional, unless there is another nested operation on a submodel
 *                             Operations on submodels will automatically get filtered by id.
 *                             If an id is then specified, both filters will be used
 *  - {object|object[]} data - Attributes to update or create
 *                             Is an array with createMany, replaceMany or upsertMany
 *  - {any} filter           - Filter the operation by a specific attribute.
 *                             The argument name is that attribute name, not `filter`
 *  - {string} order_by      - Sort results.
 *                             Value is attribute name, followed by optional + or - for ascending|descending order (default: +)
 *                             Can contain dots to select fields, e.g. order_by="furniture.size"
 **/


const { every, chain, uniq, orderBy, map } = require('lodash');
const uuiv4 = require('uuid/v4');

const { EngineError } = require('../../error');
const { validateOperationInput, validateAttributeName } = require('./validate');


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
    // Make sure attribute name is valid
    validateAttributeName(args.attribute);
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

const findManyIndexes = function({ collection, ids, filters = {} }) {
  if (ids) {
    const uniqueIds = uniq(ids);
    const indexes = uniqueIds.map(id => findOneIndex({ collection, id }));
    collection = collection.map((model, index) => indexes.includes(index) ? model : null);
  }
  const modelIndexes = chain(collection)
    .map((model, index) => {
      if (!model) { return null; }
      const matches = every(filters, (filterVal, filterName) => model[filterName] === filterVal);
      if (!matches) { return null; }
      return index;
    })
    .filter(index => index != null)
    .value();
  return modelIndexes;
};

const checkUniqueId = function ({ collection, id }) {
  const index = findOneIndex({ collection, id, required: false });
  if (index !== -1) {
    throw new EngineError(`Model with id ${id} already exists in: ${collection.modelName} (collection)`, {
      reason: 'DATABASE_MODEL_CONFLICT',
    });
  }
};

const findOne = function ({ collection, id }) {
  const index = findOneIndex({ collection, id });
  return collection[index];
};

const findMany = function ({ collection, ids = null, filters = {} }) {
  const indexes = findManyIndexes({ collection, ids, filters });
  const models = indexes.map(index => collection[index]);
  return models;
};

const deleteOne = function ({ collection, id }) {
  const index = findOneIndex({ collection, id });
  collection.splice(index, 1);
  return null;
};

const deleteMany = function ({ collection, ids = null, filters = {} }) {
  const indexes = findManyIndexes({ collection, ids, filters });
  indexes.sort();
  indexes.forEach((index, count) => {
    collection.splice(index - count, 1);
  });
  return null;
};

const updateOne = function ({ collection, data, id }) {
  const index = findOneIndex({ collection, id });
  const model = collection[index];
  const newModel = Object.assign({}, model, data);
  collection.splice(index, 1, newModel);
  return newModel;
};

const updateMany = function ({ collection, data, ids = null, filters = {} }) {
  const indexes = findManyIndexes({ collection, ids, filters });
  const newModels = indexes.map(index => {
    const model = collection[index];
    const newModel = Object.assign({}, model, data);
    collection.splice(index, 1, newModel);
    return newModel;
  });
  return newModels;
};

const createOne = function ({ collection, data, id = null }) {
  checkUniqueId({ collection, id });
  const newModelId = id || createId();
  const newModel = Object.assign({}, data, { id: newModelId });
  collection.push(newModel);
  return newModel;
};

const createMany = function ({ collection, data, ids = null }) {
  return data.map((datum, index) => createOne({ collection, data: datum, id: ids && ids[index] }));
};

const replaceOne = function ({ collection, data, id }) {
  const index = findOneIndex({ collection, id });
  const newModel = Object.assign({}, data, { id });
  collection.splice(index, 1, newModel);
  return newModel;
};

const replaceMany = function ({ collection, data, ids }) {
  return data.map((datum, index) => replaceOne({ collection, data: datum, id: ids[index] }));
};

const upsertOne = function ({ collection, data, id }) {
  const index = findOneIndex({ collection, id, required: false });
  if (index === -1) {
    return createOne({ collection, data, id });
  } else {
    return replaceOne({ collection, data, id });
  }
};

const upsertMany = function ({ collection, data, ids }) {
  return data.map((datum, index) => upsertOne({ collection, data: datum, id: ids[index] }));
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
  validateOperationInput(opts);
  const response = operations[opts.operation](opts);
  const sortedResponse = sortResponse({ response, orderByArg: opts.orderBy });
  return sortedResponse;
};

module.exports = {
  fireOperation,
  sortResponse,
};

global.collection = require('./data').Pet;
global.collection.modelName = 'Pet';
Object.assign(global, module.exports);
global.print = function () {
  console.log(JSON.stringify(global.collection, null, 2));
};