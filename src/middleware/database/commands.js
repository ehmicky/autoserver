'use strict';

/**
 * Summary of actions:
 *   findOne({ filter: { id } })
 *   findMany({ [filter], [order_by], [page_size], [before|after|page] })
 *   deleteOne({ filter: { id }, [dry_run] })
 *   deleteMany({ [filter], [order_by], [dry_run], [page_size] })
 *   updateOne({ data, filter: { id }, [dry_run] })
 *   updateMany({ data, [filter], [order_by], [dry_run], [page_size] })
 *   createOne({ data, [dry_run] })
 *   createMany({ data[], [order_by], [dry_run], [page_size] })
 *   replaceOne({ data, [dry_run] })
 *   replaceMany({ data[], [order_by], [dry_run], [page_size] })
 *   upsertOne({ data, [dry_run] })
 *   upsertMany({ data[], [order_by], [dry_run], [page_size] })
 *
 * Summary of arguments:
 *  - {object|object[]} data  - Attributes to update or create
 *                              Is an array in *Many actions
 *                              `data.id` is required in all but create*
 *  - {any} filter            - Filter the action by a specific attribute.
 *                              The argument name is that attribute name,
 *                              not `filter`
 *                              Can use JSL
 *                              `filter.id` is required and cannot use JSL
 *                              in findOne and deleteOne
 *                              Actions on submodels will automatically get
 *                              filtered by id.
 *                              If an id is then specified, both filters will
 *                              be used
 *  - {string} [order_by]     - Sort results.
 *                              Value is attribute name, followed by
 *                              optional + or - for ascending|descending order
 *                              (default: +)
 *                              Can contain dots to select fields,
 *                              e.g. order_by="furniture.size"
 *  - {integer} [page_size]   - Sets pagination size.
 *                              Using 0 disables pagination.
 *                              Default is set with server option
 *                              defaultPageSize (default: 100)
 *                              Maximum is set with server option
 *                              maxPageSize (default: 100)
 *  - {string} [before|after] - Retrieves previous|next pagination batch,
 *                              using the previous response's 'token'
 *                              Use '' for the start or the end.
 *  - {integer} [page]        - Page number, for pagination, starting at 1
 *                              Cannot be used together with `before|after`
 *  - {boolean} [dry_run]     - If true, the action will not modify the
 *                              database, but the return value will be the
 *                              same as if it did.
 **/


const { cloneDeep, orderBy, map } = require('lodash');
const uuiv4 = require('uuid/v4');

const { EngineError } = require('../../error');


const createId = function () {
  return uuiv4();
};

// order_by sorting
const sortResponse = function ({ data, orderByArg }) {
  if (!data || !(data instanceof Array)) { return data; }

  const sortedData = orderBy(
    data,
    map(orderByArg, 'attrName'),
    map(orderByArg, 'order')
  );
  return sortedData;
};

// Pagination offsetting
// If offset is too big, just return empty array
const offsetResponse = function ({ data, offset }) {
  if (offset === undefined) { return data; }
  return data.slice(offset);
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
      const message = `JSL expression should be '($ === ID)': ${jsl}`;
      throw new EngineError(message, { reason: 'INPUT_SERVER_VALIDATION' });
    }
    const id = JSON.parse(parts[1]);
    return id;
  } catch (innererror) {
    const message = `JSL expression should be '($ === ID)': ${jsl}`;
    throw new EngineError(message, {
      reason: 'INPUT_SERVER_VALIDATION',
      innererror,
    });
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
      const input = { $$: model };
      return jslInput.run(filter, input, { reason: 'INPUT_VALIDATION' });
    })
    .map(([index]) => index);
  return modelIndexes;
};

const findIndex = function ({
  collection,
  id,
  opts: { modelName, mustExist = true },
}) {
  const index = Object.entries(collection)
    .filter(([,{ id: modelId }]) => modelId === id)
    .map(([index]) => index)[0];
  if (!index && mustExist === true) {
    const message = `Could not find the model with id ${id} in: ${modelName} (collection)`;
    throw new EngineError(message, { reason: 'DATABASE_NOT_FOUND' });
  }
  if (index && mustExist === false) {
    const message = `Model with id ${id} already exists in: ${modelName} (collection)`;
    throw new EngineError(message, { reason: 'DATABASE_MODEL_CONFLICT' });
  }
  return index;
};

const readOne = function ({ collection, filter, opts }) {
  const id = filterToId({ filter });
  const index = findIndex({ collection, id, opts });
  return { data: collection[index] };
};

const readMany = function ({ collection, filter, opts }) {
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
    const model = dryRun
      ? collection[index]
      : collection.splice(index - count, 1)[0];
    return model;
  });
  return { data: models };
};

const create = function ({ collection, data, opts }) {
  const { dryRun } = opts;
  let id = data.id;
  if (id) {
    const findIndexOpts = Object.assign({}, opts, { mustExist: false });
    findIndex({ collection, id, opts: findIndexOpts });
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
  const newModels = data.map(datum => {
    return create({ collection, data: datum, opts });
  });
  return { data: newModels };
};

const update = function ({ collection, data, opts }) {
  const { dryRun } = opts;
  const index = findIndex({ collection, id: data.id, opts });

  const model = collection[index];
  const newModel = Object.assign({}, model, data);
  if (!dryRun) {
    collection.splice(index, 1, newModel);
  }

  return newModel;
};

const updateOne = function ({ collection, data, opts }) {
  const newModel = update({ collection, data, opts });
  return { data: newModel };
};

const updateMany = function ({ collection, data, opts }) {
  const newModels = data.map(datum => {
    return update({ collection, data: datum, opts });
  });
  return { data: newModels };
};

const commandHandlers = {
  readOne,
  readMany,
  deleteOne,
  deleteMany,
  updateOne,
  updateMany,
  createOne,
  createMany,
};

const fireCommand = function (commandInput) {
  const {
    command,
    opts: { orderBy, limit, noOutput, offset },
  } = commandInput;
  const response = commandHandlers[command.name](commandInput);
  response.data = sortResponse({ data: response.data, orderByArg: orderBy });
  response.data = offsetResponse({ data: response.data, offset });
  response.data = limitResponse({ data: response.data, limit });

  // Extra parameter used only for optimization, when we know we do
  // not need the result of a command
  // Only used internally by the system, i.e. not exposed to consumers.
  if (noOutput) {
    response.data = response.data instanceof Array ? [] : {};
  }

  if (response.metadata === undefined) {
    response.metadata = response.data instanceof Array
      ? Array(response.data.length).fill({})
      : {};
  }

  // TODO: Only necessary as long as we do not use real database,
  // to make sure it is not modified
  const copiedResponse = cloneDeep(response);

  return copiedResponse;
};


module.exports = {
  fireCommand,
};
