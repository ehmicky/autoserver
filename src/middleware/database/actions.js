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


const { omit, merge, every, orderBy, map, isEqual } = require('lodash');
const uuiv4 = require('uuid/v4');

const { EngineError } = require('../../error');
const { processJsl } = require('../../jsl');


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

const findIndexes = function({ collection, filter = {}, jslVarsInput }) {
  const modelIndexes = collection.reduce((indexes, model, index) => {
    // Check if a model matches a query filter
    const matches = every(filter, (value, name) => {
      // This means no JSL is used
      if (typeof value !== 'function') {
        return isEqual(model[name], value);
      }

      // TODO: remove when using MongoDB query objects
      try {
        const filterMatches = processJsl({ jsl: value, jslVarsInput, model, name, shortcut: 'model' });
        return filterMatches;
      } catch (innererror) {
        throw new EngineError(`JSL expression used as filter failed: ${value.jsl}`, {
          reason: 'INPUT_VALIDATION',
          innererror,
        });
      }
    });

    if (matches) {
      indexes.push(index);
    }
    return indexes;
  }, []);
  return modelIndexes;
};

const findIndex = function ({ collection, filter: { id }, jslVarsInput }) {
  const indexes = findIndexes({ collection, filter: { id }, jslVarsInput });
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

// attributes with writeOnce true are not updated, unless undefined
const getOmitKeys = function ({ model, writeOnceAttributes }) {
  return Object.keys(model)
    .filter(key => writeOnceAttributes.includes(key))
    .filter(key => model[key] !== undefined);
};

const findOne = function ({ collection, filter, jslVarsInput }) {
  const index = findIndex({ collection, filter, jslVarsInput });
  return collection[index];
};

const findMany = function ({ collection, filter = {}, jslVarsInput }) {
  const indexes = findIndexes({ collection, filter, jslVarsInput });
  const models = indexes.map(index => collection[index]);
  return models;
};

const deleteOne = function ({ collection, filter, jslVarsInput }) {
  const index = findIndex({ collection, filter, jslVarsInput });
  const model = collection.splice(index, 1)[0];
  return model;
};

const deleteMany = function ({ collection, filter = {}, jslVarsInput }) {
  const indexes = findIndexes({ collection, filter, jslVarsInput });
  const models = indexes.sort().map((index, count) => collection.splice(index - count, 1)[0]);
  return models;
};

const update = function ({ collection, index, data, writeOnceAttributes }) {
  const model = collection[index];
  const omitKeys = getOmitKeys({ model, writeOnceAttributes });
  const newModel = Object.assign({}, model, omit(data, omitKeys));
  collection.splice(index, 1, newModel);
  return newModel;
};

const updateOne = function ({ collection, data, filter, jslVarsInput, writeOnceAttributes }) {
  const index = findIndex({ collection, filter, jslVarsInput });
  const newModel = update({ collection, index, data, writeOnceAttributes });
  return newModel;
};

const updateMany = function ({ collection, data, filter = {}, jslVarsInput, writeOnceAttributes }) {
  const indexes = findIndexes({ collection, filter, jslVarsInput });
  const newModels = indexes.map(index => update({ collection, index, data, writeOnceAttributes }));
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

const replaceOne = function ({ collection, data, writeOnceAttributes }) {
  const index = findIndex({ collection, filter: { id: data.id } });

  const omitKeys = getOmitKeys({ model: collection[index], writeOnceAttributes });
  collection.splice(index, 1, omit(data, omitKeys));

  return data;
};

const replaceMany = function ({ collection, data, writeOnceAttributes }) {
  return data.map(datum => replaceOne({ collection, data: datum, writeOnceAttributes }));
};

const upsertOne = function ({ collection, data, writeOnceAttributes }) {
  const indexes = findIndexes({ collection, filter: { id: data.id } });
  if (indexes.length === 0) {
    return createOne({ collection, data });
  } else {
    return replaceOne({ collection, data, writeOnceAttributes });
  }
};

const upsertMany = function ({ collection, data, writeOnceAttributes }) {
  return data.map(datum => upsertOne({ collection, data: datum, writeOnceAttributes }));
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

  // TODO: Only necessary as long as we do not use real database, to make sure it is not modified
  let copiedResponse;
  if (sortedResponse && sortedResponse instanceof Array) {
    copiedResponse = sortedResponse.slice();
  } else if (sortedResponse && sortedResponse.constructor === Object) {
    copiedResponse = merge({}, sortedResponse);
  }

  return copiedResponse;
};

module.exports = {
  fireAction,
};
