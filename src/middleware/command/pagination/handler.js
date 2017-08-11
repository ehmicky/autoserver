'use strict';

const { reverseArray } = require('../../../utilities');

const {
  validatePaginationInput,
  validatePaginationOutput,
} = require('./validation');
const { mustPaginateOutput } = require('./condition');
const { getPaginationInput } = require('./input');
const { getPaginationOutput } = require('./output');
const { getPaginationInfo } = require('./info');

// Pagination layer.
// Supports several kinds of pagination:
//  - offset-based, for random access
//  - cursor-based, for serial access
//  - search query-based, e.g. by searching timestamps.
//    This is implemented by other layers though.
// Cursor-based pagination:
//  - the cursor stores the model attributes, not model.id:
//     - this allows paginating sorted and filtered requests
//     - this creates more stable results when the model is modified between
//       two batches
//  - the cursor should be opaque to consumer, i.e. is base64'd
//    (base64url variant so it is URL-friendly)
//  - the cursor is minified
// Pagination parameters are removed and transformed for the database layer to:
//   limit {integer}             - limit response size.
//                                 This might be higher than args.pageSize,
//                                 to guess if there is a previous or next page.
//   offset {integer}            - offset response size.
//                                 Only used with offset-based pagination
//   nFilter                     - with cursor-based pagination, uses the
//                                 `args.nFilter` of the previous request,
//                                 which is encoded in the cursor.
//                                 E.g. if last batch ended with model
//                                 { a: 10, b: 20 }, then we transform
//                                 args.nFilter { c: 30 } to
//                                 { c: 30 } && > { a: 10, b: 20 }
//   nOrderBy                    - same as `nFilter` but for `nOrderBy`
// Add metadata: token, page_size, has_previous_page, has_previous_page
// Actions:
//  - output is paginated with any command.name returning an array of response
//    and do not using an array of args.data, i.e.
//    readMany, deleteMany or updateMany
//  - consumer can iterate the pagination with safe command.name returning an
//    array of response, i.e. readMany
//  - this means updateMany and deleteMany command.name will paginate output,
//    but to iterate through the next batches, readMany must be used
const pagination = async function (nextFunc, input) {
  const { args, runtimeOpts: { maxPageSize } } = input;

  const paginatedInput = processInput({ input, maxPageSize });

  const response = await nextFunc(paginatedInput);

  const paginatedOutput = processOutput({ input, response, args, maxPageSize });

  return paginatedOutput;
};

// Transform args.pageSize|before|after|page into args.limit|offset|nFilter
const processInput = function ({
  input,
  input: { args, command, action, modelName, idl },
  maxPageSize,
}) {
  validatePaginationInput({
    args,
    action,
    command,
    modelName,
    maxPageSize,
    idl,
  });

  if (!mustPaginateOutput({ args, command })) { return input; }

  const paginationInput = getPaginationInput({ args });

  return { ...input, args: { ...args, ...paginationInput } };
};

// Add response metadata related to pagination:
//   token, page_size, has_previous_page, has_next_page
const processOutput = function ({
  input: { command, action, modelName, idl },
  response,
  args,
  maxPageSize,
}) {
  if (!mustPaginateOutput({ args, command })) { return response; }

  const responseA = reverseOutput({ args, response });

  const paginationOutput = getPaginationOutput({ args, response: responseA });
  const responseB = { ...responseA, ...paginationOutput };

  validatePaginationOutput({
    args,
    action,
    modelName,
    maxPageSize,
    response: responseB,
    idl,
  });

  return responseB;
};

// When using args.before, pagination is performed backward.
// We do this by inversing args.nOrderBy, which means we need to reverse output
// afterwards.
const reverseOutput = function ({ args, response }) {
  const { isBackward } = getPaginationInfo({ args });
  if (!isBackward) { return response; }

  const data = reverseArray(response.data);
  return { ...response, data };
};

module.exports = {
  pagination,
};
