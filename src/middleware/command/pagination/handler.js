'use strict';

const { cloneDeep } = require('lodash');

const {
  validatePaginationInput,
  validatePaginationOutput,
} = require('./validation');
const { mustPaginateOutput } = require('./condition');
const { getPaginationInput } = require('./input');
const { getPaginationOutput } = require('./output');
const { getPaginationInfo } = require('./info');

/**
 * Pagination layer.
 * Supports several kinds of pagination:
 *  - offset-based, for random access
 *  - cursor-based, for serial access
 *  - search query-based, e.g. by searching timestamps.
 *    This is implemented by other layers though.
 * Cursor-based pagination:
 *  - the cursor stores the model attributes, not model.id:
 *     - this allows paginating sorted and filtered requests
 *     - this creates more stable results when the model is modified between
 *       two batches
 *  - the cursor should be opaque to consumer, i.e. is base64'd
 *    (base64url variant so it is URL-friendly)
 *  - the cursor is minified
 * Parameters:
 *   page_size {integer}         - Default is server option defaultPageSize
 *                                 (default: 100)
 *                                 Maximum is set with server option
 *                                 maxPageSize (default: 100)
 *                                 Using 0 disables pagination.
 *   before|after {string}       - Retrieves previous|next pagination batch,
 *                                 using the previous response's 'token'
 *                                 Use '' for the start or the end.
 *                                 Cannot be used together with `args.filter`
 *                                 nor `args.order_by`.
 *   page {integer}              - Page number, for pagination, starting at 1
 *                                 Cannot be used together with `before|after`
 * Those parameters are removed and transformed for the database layer to:
 *   limit {integer}             - limit response size.
 *                                 This might be higher than args.pageSize,
 *                                 to guess if there is a previous or next page.
 *   offset {integer}            - offset response size.
 *                                 Only used with offset-based pagination
 *   nFilter                     - with cursor-based pagination, uses the
 *                                 `args.nFilter` of the previous request,
 *                                 which is encoded in the cursor.
 *                                 E.g. if last batch ended with model
 *                                 { a: 10, b: 20 }, then we transform
 *                                 args.nFilter { c: 30 } to
 *                                 { c: 30 } && > { a: 10, b: 20 }
 *   nOrderBy                    - same as `nFilter` but for `nOrderBy`
 * Add metadata:
 *   token {string}              - token of a given model, to use with
 *                                 args.before|after
 *   page_size {integer}         - Might be lower than the requested page size
 *   has_previous_page {boolean}
 *   has_next_page {boolean}
 * Actions:
 *  - output is paginated with any command.name returning an array of response
 *    and do not using an array of args.data, i.e.
 *    readMany, deleteMany or updateMany
 *  - consumer can iterate the pagination with safe command.name returning an
 *    array of response, i.e. readMany
 *  - this means updateMany and deleteMany command.name will paginate output,
 *    but to iterate through the next batches, readMany must be used
 **/
const pagination = async function (nextFunc, input) {
  const { args, serverOpts: { maxPageSize } } = input;
  const oArgs = cloneDeep(args);

  const paginatedInput = processInput({ input, maxPageSize });

  const response = await nextFunc(paginatedInput);

  const paginatedOutput = processOutput({
    input,
    response,
    args: oArgs,
    maxPageSize,
  });

  return paginatedOutput;
};

// Transform args.pageSize|before|after|page into args.limit|offset|nFilter
const processInput = function ({
  input,
  input: { args, command, action, modelName },
  maxPageSize,
}) {
  validatePaginationInput({
    args,
    action,
    command,
    modelName,
    maxPageSize,
  });

  if (!mustPaginateOutput({ args, command })) { return input; }

  const paginationInput = getPaginationInput({ args });
  const newArgs = Object.assign({}, args, paginationInput);

  return Object.assign({}, input, { args: newArgs });
};

// Add response metadata related to pagination:
//   token, page_size, has_previous_page, has_next_page
const processOutput = function ({
  input: { command, action, modelName },
  response,
  args,
  maxPageSize,
}) {
  if (!mustPaginateOutput({ args, command })) { return response; }

  reverseOutput({ args, response });

  const paginationOutput = getPaginationOutput({ args, response });
  const newResponse = Object.assign({}, response, paginationOutput);

  validatePaginationOutput({
    args,
    action,
    modelName,
    maxPageSize,
    response: newResponse,
  });

  return newResponse;
};

// When using args.before, pagination is performed backward.
// We do this by inversing args.nOrderBy, which means we need to reverse output
// afterwards.
const reverseOutput = function ({ args, response }) {
  const { isBackward } = getPaginationInfo({ args });

  if (isBackward) {
    response.data = response.data.reverse();
  }
};

module.exports = {
  pagination,
};
