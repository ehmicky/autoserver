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
  // Only for top-level find|patch commands
  return commandpath.split('.').length === 1 &&
    PAGINATION_TOP_COMMANDS.includes(top.command.type) &&
    PAGINATION_COMMANDS.includes(command) &&
    !isPaginationDisabled({ runOpts, args });
};

const PAGINATION_TOP_COMMANDS = ['find', 'patch'];
const PAGINATION_COMMANDS = ['find'];

// Using args.pagesize 0 or pagesize 0 disables pagination
const isPaginationDisabled = function ({ runOpts, args }) {
  const pagesize = getPagesize({ args, runOpts });
  return pagesize === 0;
};

module.exports = {
  willPaginateOutput,
};
