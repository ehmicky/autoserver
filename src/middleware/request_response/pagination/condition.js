'use strict';

const { getPagesize } = require('./info');

// Whether request will be paginated
const willPaginate = function ({
  args,
  command,
  commandpath,
  top,
  schema,
}) {
  // Only for top-level findMany, and patchMany (its currentData `find` command)
  return commandpath === '' &&
    PAGINATION_TOP_COMMANDS.includes(top.command.name) &&
    PAGINATION_COMMANDS.includes(command) &&
    !isPaginationDisabled({ schema, args });
};

const PAGINATION_TOP_COMMANDS = ['findMany', 'patchMany'];
const PAGINATION_COMMANDS = ['find'];

// Using args.pagesize 0 or pagesize 0 disables pagination
const isPaginationDisabled = function ({ schema, args }) {
  const pagesize = getPagesize({ args, schema });
  return pagesize === 0;
};

// `patch` commands can only iterate forward, as pagination is here only
// meant for database load controlling, not as a client feature.
// This means:
//  - offset pagination is not available
//  - backward cursor pagination is not available
const isOnlyForwardCursor = function ({ top }) {
  return FORWARD_TOP_COMMANDS.includes(top.command.name);
};

const FORWARD_TOP_COMMANDS = ['patchMany'];

module.exports = {
  willPaginate,
  isOnlyForwardCursor,
};
