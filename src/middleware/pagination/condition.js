'use strict';


// Whether consumers can specify all pagination arguments,
// including args.page_size, args.before|after|page
// Implies output pagination
const allowFullPagination = function ({
  args: { page_size: pageSize },
  dbCallFull,
}) {
  return fullPaginationDbCallFulls.includes(dbCallFull) &&
    !isPaginationDisabled({ pageSize });
};
const fullPaginationDbCallFulls = ['findMany'];

// Whether output will be paginated
const mustPaginateOutput = function ({
  args: { page_size: pageSize },
  dbCallFull,
}) {
  return outputPaginationDbCallFulls.includes(dbCallFull) &&
    !isPaginationDisabled({ pageSize });
};
const outputPaginationDbCallFulls = [
  'findMany',
  'deleteMany',
  'updateMany',
  'createMany',
];

// Using args.page_size 0 or defaultPageSize 0 disables pagination
const isPaginationDisabled = function ({ pageSize }) {
  return pageSize === 0 || pageSize === undefined;
};

module.exports = {
  allowFullPagination,
  mustPaginateOutput,
};
