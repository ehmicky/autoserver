'use strict';

/**
 * Summary of actions:
 *   findOne    ({ filter: { id }, [no_output] })
 *   findMany   ({ [filter], [order_by], [page_size], [before|after|page],
 *               [no_output] })
 *   deleteOne  ({ filter: { id }, [dry_run], [no_output] })
 *   deleteMany ({ [filter], [order_by], [dry_run], [page_size], [no_output] })
 *   updateOne  ({ data, filter: { id }, [dry_run], [no_output] })
 *   updateMany ({ data, [filter], [order_by], [dry_run], [page_size],
 *               [no_output] })
 *   createOne  ({ data, [dry_run], [no_output] })
 *   createMany ({ data[], [order_by], [dry_run], [page_size], [no_output] })
 *   replaceOne ({ data, [dry_run], [no_output] })
 *   replaceMany({ data[], [order_by], [dry_run], [page_size], [no_output] })
 *   upsertOne  ({ data, [dry_run], [no_output] })
 *   upsertMany ({ data[], [order_by], [dry_run], [page_size], [no_output] })
 *
 * Summary of arguments:
 *  - {object|object[]} data  - Attributes to update or create
 *                              Is an array in *Many actions
 *                              `data.id` is required in all but create*
 *                              Can contain JSL, where $/$$ represents the
 *                              current attribute/model. It will not be applied
 *                              if the current attribute is null|undefined
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
 *  - {boolean} [no_output]  -  Defaults to true for `delete`, false otherwise
 *                              If true, the action will modify the database, '
 *                              but return an empty response
 *                              (i.e. empty object or empty array)
 *                              This can also be set for all the actions using
 *                              any of:
 *                                - X-No-Output {boolean} request header,
 *                                  for any protocol
 *                                - prefer: return=minimal request header,
 *                                  for HTTP
 *                                - HEAD HTTP method, instead of GET
 **/


const { cloneDeep } = require('lodash');
const uuiv4 = require('uuid/v4');

const { EngineError } = require('../../../error');
const { processResponse } = require('./process_response');


// '($ === ID)' -> ID
const filterToId = function ({ filter }) {
  try {
    const parts = idJslRegExp.exec(filter);
    if (!parts) {
      const message = `JSL expression should be '($ === ID)': ${filter}`;
      throw new EngineError(message, { reason: 'INPUT_SERVER_VALIDATION' });
    }
    const id = JSON.parse(parts[1]);
    return id;
  } catch (innererror) {
    const message = `JSL expression should be '($ === ID)': ${filter}`;
    throw new EngineError(message, {
      reason: 'INPUT_SERVER_VALIDATION',
      innererror,
    });
  }
};
// Look for '(($ === ID))'
const idJslRegExp = /^\(\(\$\$\.id\s*===\s*(.*)\)\)$/;

const findIndexes = function({ collection, filter, opts: { jsl } }) {
  if (!filter) {
    return collection.map((model, index) => index);
  }

  const modelIndexes = Object.entries(collection)
    // Check if a model matches a query filter
    .filter(([/*index*/, model]) => {
      // TODO: remove when using MongoDB query objects
      const params = { $$: model };
      return jsl.run({ value: filter, params, type: 'filter' });
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

const createId = function () {
  return uuiv4();
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
  const { command, opts } = commandInput;
  const response = commandHandlers[command.name](commandInput);

  Object.assign(response, processResponse({ response, command, opts }));

  // TODO: Only necessary as long as we do not use real database,
  // to make sure it is not modified
  const copiedResponse = cloneDeep(response);

  return copiedResponse;
};


module.exports = {
  fireCommand,
};
