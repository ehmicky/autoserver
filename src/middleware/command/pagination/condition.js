'use strict';

// Whether consumers can specify all pagination arguments,
// including args.pageSize, args.before|after|page
// Implies output pagination
const allowFullPagination = function ({ args, command }) {
  return fullPaginationCommands.includes(command) &&
    !isPaginationDisabled({ args, command });
};

const fullPaginationCommands = ['find'];

// Whether output will be paginated
const mustPaginateOutput = function ({ args, command }) {
  return paginationCommands.includes(command) &&
    !isPaginationDisabled({ args });
};

const paginationCommands = ['find', 'update', 'delete'];

// Using args.pageSize 0 or defaultPageSize 0 disables pagination
const isPaginationDisabled = function ({ args: { pageSize } }) {
  return pageSize === 0 || pageSize === undefined;
};

module.exports = {
  allowFullPagination,
  mustPaginateOutput,
};
