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


const { omit, cloneDeep, every, orderBy, map, isEqual } = require('lodash');
const uuiv4 = require('uuid/v4');

const { EngineError } = require('../../error');
const { processJsl } = require('../../jsl');


const createId = function () {
  return uuiv4();
};

const orderPostfixRegexp = /(.*)(\+|-)$/;
const sortResponse = function ({ data, orderByArg = 'id+' }) {
  if (!data || !(data instanceof Array)) { return data; }

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
      args.attribute = order;
    }
    return args;
  });

  const sortedData = orderBy(data, map(orderArgs, 'attribute'), map(orderArgs, 'ascending'));
  return sortedData;
};

const findIndexes = function({ collection, filter = {}, jslInput }) {
  const modelIndexes = collection.reduce((indexes, model, index) => {
    // Check if a model matches a query filter
    const matches = every(filter, (value, attrName) => {
      // This means no JSL is used
      if (typeof value !== 'function') {
        return isEqual(model[attrName], value);
      }

      // TODO: remove when using MongoDB query objects
      try {
        const modelInput = { parent: model, model, value: model[attrName], attrName };
        const filterMatches = processJsl(Object.assign({ jsl: value }, jslInput, { modelInput }));
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

const findIndex = function ({ collection, filter: { id }, jslInput }) {
  const indexes = findIndexes({ collection, filter: { id }, jslInput });
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

const findOne = function ({ collection, filter, jslInput }) {
  const index = findIndex({ collection, filter, jslInput });
  return { data: collection[index] };
};

const findMany = function ({ collection, filter = {}, jslInput }) {
  const indexes = findIndexes({ collection, filter, jslInput });
  const models = indexes.map(index => collection[index]);
  return { data: models };
};

const deleteOne = function ({ collection, filter, jslInput, opts: { dryRun } }) {
  const index = findIndex({ collection, filter, jslInput });
  const model = dryRun ? collection[index] : collection.splice(index, 1)[0];
  return { data: model };
};

const deleteMany = function ({ collection, filter = {}, jslInput, opts: { dryRun } }) {
  const indexes = findIndexes({ collection, filter, jslInput }).sort();
  const models = indexes.map((index, count) => {
    const model = dryRun ? collection[index] : collection.splice(index - count, 1)[0];
    return model;
  });
  return { data: models };
};

const update = function ({ collection, index, data, opts: { writeOnceAttributes, dryRun } }) {
  const model = collection[index];
  const omitKeys = getOmitKeys({ model, writeOnceAttributes });
  const newModel = Object.assign({}, model, omit(data, omitKeys));
  if (!dryRun) {
    collection.splice(index, 1, newModel);
  }
  return newModel;
};

const updateOne = function ({ collection, data, filter, jslInput, opts }) {
  const index = findIndex({ collection, filter, jslInput });
  const newModel = update({ collection, index, data, opts });
  return { data: newModel };
};

const updateMany = function ({ collection, data, filter = {}, jslInput, opts }) {
  const indexes = findIndexes({ collection, filter, jslInput });
  const newModels = indexes.map(index => update({ collection, index, data, opts }));
  return { data: newModels };
};

const create = function ({ collection, data, opts: { dryRun } }) {
  let id = data.id;
  if (id) {
    checkUniqueId({ collection, id });
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

const replace = function ({ collection, data, opts: { writeOnceAttributes, dryRun } }) {
  const index = findIndex({ collection, filter: { id: data.id } });

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
  const indexes = findIndexes({ collection, filter: { id: data.id } });
  if (indexes.length === 0) {
    return createOne({ collection, data, opts });
  } else {
    return replaceOne({ collection, data, opts });
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
  const response = actions[opts.action](opts);
  response.data = sortResponse({ data: response.data, orderByArg: opts.opts.orderBy });
  response.metadata = response.metadata || {};

  // TODO: Only necessary as long as we do not use real database, to make sure it is not modified
  const copiedResponse = cloneDeep(response);

  return copiedResponse;
};

module.exports = {
  fireAction,
};
