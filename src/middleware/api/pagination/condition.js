'use strict';


// Whether consumers can specify all pagination arguments,
// including args.pageSize, args.before|after|page
// Implies output pagination
const allowFullPagination = function ({ args, command }) {
  return fullPaginationCommandNames.includes(command.name) &&
    !isPaginationDisabled({ args });
};
const fullPaginationCommandNames = ['readMany'];

// Whether output will be paginated
const mustPaginateOutput = function ({ args }) {
  return !isPaginationDisabled({ args });
};

// Using args.pageSize 0 or defaultPageSize 0 disables pagination
const isPaginationDisabled = function ({ args: { pageSize, pagination } }) {
  return !pagination || pageSize === 0 || pageSize === undefined;
};

module.exports = {
  allowFullPagination,
  mustPaginateOutput,
};
