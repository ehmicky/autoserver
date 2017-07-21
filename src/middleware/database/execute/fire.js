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

const { processResponse } = require('./process_response');
const { validateResponse } = require('./validate');
const commands = require('./commands');

const fireCommand = function (commandInput) {
  const { command, opts } = commandInput;
  const response = commands[command.name](commandInput);

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
