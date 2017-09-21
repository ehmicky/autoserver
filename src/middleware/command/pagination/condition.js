'use strict';

// Whether consumers can specify all pagination arguments,
// including args.pageSize, args.before|after|page
// Implies output pagination
const allowFullPagination = function ({ args, command }) {
  return fullPaginationCommands.includes(command) &&
    !isPaginationDisabled({ args });
};

const fullPaginationCommands = ['read'];

// Whether output will be paginated
const mustPaginateOutput = function ({ args }) {
  return !isPaginationDisabled({ args });
};

const isPaginationDisabled = function ({ args, args: { pageSize } }) {
  return commandDoesNotPaginate({ args }) ||
    // Using args.pageSize 0 or defaultPageSize 0 disables pagination
    pageSize === 0 ||
    pageSize === undefined;
};

const commandDoesNotPaginate = function ({ args: { internal, filter } }) {
  // Internal commands do not paginate
  return internal ||
    // Pagination requires `args.filter`
    filter === undefined;
};

module.exports = {
  allowFullPagination,
  mustPaginateOutput,
};
