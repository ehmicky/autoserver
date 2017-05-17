'use strict';


// Whether consumers can specify all pagination arguments,
// including args.page_size, args.before|after|page
// Implies output pagination
const allowFullPagination = function ({
  args: { page_size: pageSize },
  command,
}) {
  return fullPaginationCommandNames.includes(command.name) &&
    !isPaginationDisabled({ pageSize });
};
const fullPaginationCommandNames = ['readMany'];

// Whether output will be paginated
const mustPaginateOutput = function ({
  args: { page_size: pageSize },
  command,
}) {
  return outputPaginationCommandNames.includes(command.name) &&
    !isPaginationDisabled({ pageSize });
};
const outputPaginationCommandNames = [
  'readMany',
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
