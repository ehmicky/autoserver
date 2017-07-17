'use strict';

/**
 * Summary of actions:
 *   findOne    ({ filter: { id } })
 *   findMany   ({ [filter], [order_by], [page_size], [before|after|page] })
 *   deleteOne  ({ filter: { id } })
 *   deleteMany ({ [filter], [order_by], [page_size] })
 *   updateOne  ({ data, filter: { id } })
 *   updateMany ({ data, [filter], [order_by], [page_size] })
 *   createOne  ({ data })
 *   createMany ({ data[], [order_by], [page_size] })
 *   replaceOne ({ data })
 *   replaceMany({ data[], [order_by], [page_size] })
 *   upsertOne  ({ data })
 *   upsertMany ({ data[], [order_by], [page_size] })
 *
 * Summary of arguments:
 *  - {object|object[]} data     - Attributes to update or create
 *                                 Is an array in *Many actions
 *                                 `data.id` is required in all but create*
 *                                 Can contain JSL, where $/$$ represents the
 *                                 current attribute/model. It will not be
 *                                 applied if the current attribute is
 *                                 null|undefined
 *  - {any} filter               - Filter the action by a specific attribute.
 *                                 The argument name is that attribute name,
 *                                 not `filter`
 *                                 Can use JSL
 *                                 `filter.id` is required and cannot use JSL
 *                                 in findOne and deleteOne
 *                                 Actions on submodels will automatically get
 *                                 filtered by id.
 *                                 If an id is then specified, both filters will
 *                                 be used
 *  - {string} [order_by]        - Sort results.
 *                                 Value is attribute name, followed by
 *                                 optional + or - for ascending|descending
 *                                 order (default: +)
 *                                 Can contain dots to select fields,
 *                                 e.g. order_by="furniture.size"
 *  - {integer} [page_size]      - Sets pagination size.
 *                                 Using 0 disables pagination.
 *                                 Default is set with server option
 *                                 defaultPageSize (default: 100)
 *                                 Maximum is set with server option
 *                                 maxPageSize (default: 100)
 *  - {string} [before|after]    - Retrieves previous|next pagination batch,
 *                                 using the previous response's 'token'
 *                                 Use '' for the start or the end.
 *                                 Cannot be used together with `filter` nor
 *                                 `order_by`.
 *  - {integer} [page]           - Page number, for pagination, starting at 1
 *                                 Cannot be used together with `before|after`
 * Summary of settings:
 *  - {boolean} [noOutput=false] - If true, the operation will modify the
 *                                 database, but return an empty response.
 *                                 Defaults to true for `delete`,
 *                                 false otherwise.
 *                                 This can also be set with:
 *                                  - prefer: return=minimal HTTP request header
 *  - {boolean} [dryRun=false]   - If true, the action will not modify the
 *                                 database, but the return value will be the
 *                                 same as if it did.
 **/

const { cloneDeep } = require('lodash');
const uuiv4 = require('uuid/v4');

const { EngineError } = require('../../../error');
const { processResponse } = require('./process_response');
const { validateResponse } = require('./validate');

// '($ === ID)' -> ID
const filterToId = function ({ nFilter }) {
  try {
    const parts = idJslRegExp.exec(nFilter);
    if (!parts) {
      const message = `JSL expression should be '($ === ID)': ${nFilter}`;
      throw new EngineError(message, { reason: 'INPUT_SERVER_VALIDATION' });
    }
    const id = JSON.parse(parts[1]);
    return id;
  } catch (innererror) {
    const message = `JSL expression should be '($ === ID)': ${nFilter}`;
    throw new EngineError(message, {
      reason: 'INPUT_SERVER_VALIDATION',
      innererror,
    });
  }
};
// Look for '(($ === ID))'
const idJslRegExp = /^\(\(\$\$\.id\s*===\s*(.*)\)\)$/;

const findIndexes = function ({ collection, nFilter, opts: { jsl } }) {
  if (!nFilter) {
    return collection.map((model, index) => index);
  }

  const modelIndexes = Object.entries(collection)
    // Check if a model matches a query nFilter
    .filter(([/*index*/, model]) => {
      // TODO: remove when using MongoDB query objects
      const params = { $$: model };
      return jsl.run({ value: nFilter, params, type: 'filter' });
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
    .filter(([, { id: modelId }]) => modelId === id)
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

const readOne = function ({ collection, nFilter, opts }) {
  const id = filterToId({ nFilter });
  const index = findIndex({ collection, id, opts });
  return { data: collection[index] };
};

const readMany = function ({ collection, nFilter, opts }) {
  const indexes = findIndexes({ collection, nFilter, opts });
  const models = indexes.map(index => collection[index]);
  return { data: models };
};

const deleteOne = function ({ collection, nFilter, opts, opts: { dryRun } }) {
  const id = filterToId({ nFilter });
  const index = findIndex({ collection, id, opts });
  const model = dryRun ? collection[index] : collection.splice(index, 1)[0];
  return { data: model };
};

const deleteMany = function ({ collection, nFilter, opts, opts: { dryRun } }) {
  const indexes = findIndexes({ collection, nFilter, opts }).sort();
  const models = indexes.map((index, count) => {
    const model = dryRun
      ? collection[index]
      : collection.splice(index - count, 1)[0];
    return model;
  });
  return { data: models };
};

const create = function ({ collection, newData, opts, opts: { dryRun } }) {
  let id = newData.id;
  if (id) {
    const findIndexOpts = Object.assign({}, opts, { mustExist: false });
    findIndex({ collection, id, opts: findIndexOpts });
  } else {
    id = createId();
  }

  const newModel = Object.assign({}, newData, { id });
  if (!dryRun) {
    collection.push(newModel);
  }
  return newModel;
};

const createId = function () {
  return uuiv4();
};

const createOne = function ({ collection, newData, opts }) {
  const newModel = create({ collection, newData, opts });
  return { data: newModel };
};

const createMany = function ({ collection, newData, opts }) {
  const newModels = newData.map(datum => {
    return create({ collection, newData: datum, opts });
  });
  return { data: newModels };
};

const update = function ({ collection, newData, opts, opts: { dryRun } }) {
  const index = findIndex({ collection, id: newData.id, opts });

  const model = collection[index];
  const newModel = Object.assign({}, model, newData);
  if (!dryRun) {
    collection.splice(index, 1, newModel);
  }

  return newModel;
};

const updateOne = function ({ collection, newData, opts }) {
  const newModel = update({ collection, newData, opts });
  return { data: newModel };
};

const updateMany = function ({ collection, newData, opts }) {
  const newModels = newData.map(datum => {
    return update({ collection, newData: datum, opts });
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

  validateResponse({ command, response });

  // TODO: Only necessary as long as we do not use real database,
  // to make sure it is not modified
  const copiedResponse = cloneDeep(response);

  return copiedResponse;
};

module.exports = {
  fireCommand,
};
