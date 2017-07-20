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

const isPaginationDisabled = function ({
  args: { pageSize, internal, filter },
  command: { multiple },
}) {
  // Internal commands do not paginate
  return internal ||
    // Pagination requires `args.filter`
    filter === undefined ||
    // *One commands do not paginate
    !multiple ||
    // Using args.pageSize 0 or defaultPageSize 0 disables pagination
    pageSize === 0 ||
    pageSize === undefined;
};

module.exports = {
  allowFullPagination,
  mustPaginateOutput,
};
