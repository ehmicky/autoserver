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
 *  - each paginated request must reuse the same args.filter and args.order_by
 * Parameters:
 *   page_size {integer}         - Default is server option defaultPageSize
 *                                 (default: 100)
 *                                 Maximum is set with server option
 *                                 maxPageSize (default: 100)
 *                                 Using 0 disables pagination.
 *   before|after {string}       - Retrieves previous|next pagination batch,
 *                                 using the previous response's 'token'
 *                                 Use '' for the start or the end.
 *   page {integer}              - Page number, for pagination, starting at 1
 *                                 Cannot be used together with `before|after`
 * Those parameters are removed and transformed for the database layer to:
 *   limit {integer}             - limit response size.
 *                                 This might be higher than args.page_size,
 *                                 to guess if there is a previous or next page.
 *   offset {integer}            - offset response size.
 *                                 Only used with offset-based pagination
 *   filter                      - with cursor-based pagination, patches
 *                                 args.filter to make sure we start the request
 *                                 where we last left off.
 *                                 E.g. if last batch ended with model
 *                                 { a: 10, b: 20 }, then we transform
 *                                 args.filter { c: 30 } to
 *                                 { c: 30 } && > { a: 10, b: 20 }
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
const pagination = function ({ maxPageSize }) {
  return async function pagination(input) {
    const { args, sysArgs } = input;
    const originalArgs = cloneDeep(args);

    const paginatedInput = processInput({ input, sysArgs, maxPageSize });
    const response = await this.next(paginatedInput);

    const paginatedOutput = processOutput({
      input,
      response,
      args: originalArgs,
      sysArgs,
      maxPageSize,
    });
    return paginatedOutput;
  };
};

// Transform args.page_size|before|after|page into args.limit|offset|filter
const processInput = function ({ input, sysArgs, maxPageSize }) {
  const { args, command, action, modelName } = input;

  validatePaginationInput({
    args,
    sysArgs,
    action,
    command,
    modelName,
    maxPageSize,
  });

  if (mustPaginateOutput({ args, sysArgs })) {
    const paginationInput = getPaginationInput({ args });
    Object.assign(input, paginationInput);
  }

  return input;
};

// Add response metadata related to pagination:
//   token, page_size, has_previous_page, has_next_page
const processOutput = function ({
  input,
  response,
  args,
  sysArgs,
  maxPageSize,
}) {
  const { action, modelName } = input;

  reverseOutput({ args, response });

  if (mustPaginateOutput({ args, sysArgs })) {
    const paginationOutput = getPaginationOutput({ args, response });
    Object.assign(response, paginationOutput);

    validatePaginationOutput({
      args,
      action,
      modelName,
      maxPageSize,
      response,
    });
  }

  return response;
};

// When using args.before, pagination is performed backward.
// We do this by inversing args.order_by, which means we need to reverse output
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
