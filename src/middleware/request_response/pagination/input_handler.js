'use strict';

const { validatePaginationInput } = require('./validation');
const { mustPaginateOutput } = require('./condition');
const { getPaginationInput } = require('./input');

// Pagination input middleware.
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
//                                 This might be higher than args.pagesize,
//                                 to guess if there is a previous or next page.
//   offset {integer}            - offset response size.
//                                 Only used with offset-based pagination
//   filter                      - with cursor-based pagination, uses the
//                                 `args.filter` of the previous request,
//                                 which is encoded in the cursor.
//                                 E.g. if last batch ended with model
//                                 { a: 10, b: 20 }, then we transform
//                                 args.filter { c: 30 } to
//                                 { c: 30, a: { _gt: 10 }, b: { _gt: 20 } }
//   order                    - same as `filter` but for `order`
// Add metadata: token, pagesize, has_previous_page, has_previous_page
// Commands:
//  - output is paginated with any command returning an array of response
//    and do not using an array of args.data, i.e.
//    findMany, deleteMany or patchMany
//  - consumer can iterate the pagination with safe command returning an
//    array of response, i.e. findMany
//  - this means `upsert` and `delete` commands will paginate output,
//    but to iterate through the next batches, findMany must be used
const handlePaginationInput = function ({ args, command, runOpts }) {
  validatePaginationInput({ args, command, runOpts });

  if (!mustPaginateOutput({ args, command })) { return; }

  const paginationInput = getPaginationInput({ args });

  return { args: { ...args, ...paginationInput } };
};

module.exports = {
  handlePaginationInput,
};
