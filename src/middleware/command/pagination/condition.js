'use strict';

// Whether consumers can specify all pagination arguments,
// including args.pageSize, args.before|after|page
// Implies output pagination
const allowFullPagination = function ({ args, command }) {
  return fullPaginationCommands.includes(command.name) &&
    !isPaginationDisabled({ args, command });
};

const fullPaginationCommands = ['readMany'];

// Whether output will be paginated
const mustPaginateOutput = function ({ args, command }) {
  return !isPaginationDisabled({ args, command });
};

const isPaginationDisabled = function ({ args, args: { pageSize }, command }) {
  return commandDoesNotPaginate({ args, command }) ||
    // Using args.pageSize 0 or defaultPageSize 0 disables pagination
    pageSize === 0 ||
    pageSize === undefined;
};

const commandDoesNotPaginate = function ({
  args: { internal, filter },
  command: { multiple },
}) {
  // Internal commands do not paginate
  return internal ||
    // Pagination requires `args.filter`
    filter === undefined ||
    // *One commands do not paginate
    !multiple;
};

module.exports = {
  allowFullPagination,
  mustPaginateOutput,
};
