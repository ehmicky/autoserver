'use strict';

/**
 * Summary of actions:
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
 *  - {any} filter           - Filter the action by a specific attribute.
 *                             The argument name is that attribute name, not `filter`
 *                             Can use JSL
 *                             `filter.id` is required and cannot use JSL in findOne, deleteOne and updateOne
 *  - {string} [order_by]    - Sort results.
 *                             Value is attribute name, followed by optional + or - for ascending|descending order (default: +)
 *                             Can contain dots to select fields, e.g. order_by="furniture.size"
 *
 * Actions on submodels will automatically get filtered by id.
 * If an id is then specified, both filters will be used
 * For createOne:
 *   - it is the id the newly created instance
 *   - it is optional, unless there is another nested action on a submodel
 **/


const { every, orderBy, map, isEqual } = require('lodash');
const uuiv4 = require('uuid/v4');

const { EngineError } = require('../../error');
const { getJslVariables, processJsl, evalJsl } = require('../jsl');


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

const findIndexes = function({ collection, filter = {}, info, params }) {
  const modelIndexes = collection.reduce((indexes, model, index) => {
    // Check if a model matches a query filter
    const matches = every(filter, (value, name) => {
      // This means no JSL is used
      if (!value || !value.eval) {
        return isEqual(model[name], value);
      }

      const variables = getJslVariables({ info, params, model });

      // TODO: remove when using MongoDB query objects
      const filterMatches = processJsl({ value: value.eval, name, variables, processor: evalJsl });
      return filterMatches;
    });

    if (matches) {
      indexes.push(index);
    }
    return indexes;
  }, []);
  return modelIndexes;
};

const findIndex = function ({ collection, filter: { id }, info, params }) {
  const indexes = findIndexes({ collection, filter: { id }, info, params });
  if (indexes.length === 0) {
    throw new EngineError(`Could not find the model with id ${id} in: ${collection.modelName} (collection)`, {
      reason: 'DATABASE_NOT_FOUND',
    });
  }
  return indexes[0];
};

const checkUniqueId = function ({ collection, id }) {
  const indexes = findIndexes({ collection, filter: { id } });
  if (indexes.length > 0) {
    throw new EngineError(`Model with id ${id} already exists in: ${collection.modelName} (collection)`, {
      reason: 'DATABASE_MODEL_CONFLICT',
    });
  }
};

const findOne = function ({ collection, filter, info, params }) {
  const index = findIndex({ collection, filter, info, params });
  return collection[index];
};

const findMany = function ({ collection, filter = {}, info, params }) {
  const indexes = findIndexes({ collection, filter, info, params });
  const models = indexes.map(index => collection[index]);
  return models;
};

const deleteOne = function ({ collection, filter, info, params }) {
  const index = findIndex({ collection, filter, info, params });
  const model = collection.splice(index, 1)[0];
  return model;
};

const deleteMany = function ({ collection, filter = {}, info, params }) {
  const indexes = findIndexes({ collection, filter, info, params });
  const models = indexes.sort().map((index, count) => collection.splice(index - count, 1)[0]);
  return models;
};

const updateOne = function ({ collection, data, filter, info, params }) {
  const index = findIndex({ collection, filter, info, params });
  const model = collection[index];
  const newModel = Object.assign({}, model, data);
  collection.splice(index, 1, newModel);
  return newModel;
};

const updateMany = function ({ collection, data, filter = {}, info, params }) {
  const indexes = findIndexes({ collection, filter, info, params });
  const newModels = indexes.map(index => {
    const model = collection[index];
    const newModel = Object.assign({}, model, data);
    collection.splice(index, 1, newModel);
    return newModel;
  });
  return newModels;
};

const createOne = function ({ collection, data }) {
  let id = data.id;
  if (id) {
    checkUniqueId({ collection, id });
  } else {
    id = createId();
  }

  const newModel = Object.assign({}, data, { id });
  collection.push(newModel);
  return newModel;
};

const createMany = function ({ collection, data }) {
  return data.map(datum => createOne({ collection, data: datum }));
};

const replaceOne = function ({ collection, data }) {
  const index = findIndex({ collection, filter: { id: data.id } });
  collection.splice(index, 1, data);
  return data;
};

const replaceMany = function ({ collection, data }) {
  return data.map(datum => replaceOne({ collection, data: datum }));
};

const upsertOne = function ({ collection, data }) {
  const indexes = findIndexes({ collection, filter: { id: data.id } });
  if (indexes.length === 0) {
    return createOne({ collection, data });
  } else {
    return replaceOne({ collection, data });
  }
};

const upsertMany = function ({ collection, data }) {
  return data.map(datum => upsertOne({ collection, data: datum }));
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
  const response = actions[opts.action](opts);
  const sortedResponse = sortResponse({ response, orderByArg: opts.orderBy });
  return sortedResponse;
};

module.exports = {
  fireAction,
};
