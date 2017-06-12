'use strict';


// Whether consumers can specify all pagination arguments,
// including args.page_size, args.before|after|page
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

// Using args.page_size 0 or defaultPageSize 0 disables pagination
const isPaginationDisabled = function ({
  args: { page_size: pageSize, pagination },
}) {
  return !pagination || pageSize === 0 || pageSize === undefined;
};

module.exports = {
  allowFullPagination,
  mustPaginateOutput,
};
