'use strict';

const { getPagesize } = require('./info');

// Whether output will be paginated
const willPaginateOutput = function ({
  args,
  command,
  commandpath,
  top,
  runOpts,
}) {
  return isTopLevel({ commandpath }) &&
    PAGINATION_TOP_COMMANDS.includes(top.command.name) &&
    PAGINATION_COMMANDS.includes(command) &&
    !isPaginationDisabled({ runOpts, args });
};

// Only for top-level findMany, and patchMany (its currentData `find` command)
const isTopLevel = function ({ commandpath }) {
  return commandpath.split('.').length === 1;
};

const PAGINATION_TOP_COMMANDS = ['findMany', 'patchMany'];
const PAGINATION_COMMANDS = ['find'];

// Using args.pagesize 0 or pagesize 0 disables pagination
const isPaginationDisabled = function ({ runOpts, args }) {
  const pagesize = getPagesize({ args, runOpts });
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
  willPaginateOutput,
  isOnlyForwardCursor,
};
