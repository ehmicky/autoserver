'use strict';

// Merge `model.authorize` `$model.*` to `args.filter`
// If it can be already guessed that the model is not authorized, throw
// directly
const addAuthorizeFilter = function ({
  command,
  authorize,
  args,
  args: { filter },
}) {
  // `model.authorize` is merged `args.filter` only for `find` commands since
  // other commands do not have `args.filter`.
  // However, all write commands first fire `currentData` `find` actions,
  // which means `$model.*` authorization is checked for write actions then
  // as well.
  if (!FILTER_COMMANDS.includes(command)) { return args; }

  const filterA = getFilter({ authorize, filter });
  // Keep current `args.filter` as `args.preAuthorizeFilter`
  const argsA = { ...args, filter: filterA, preAuthorizeFilter: filter };

  return argsA;
};

const FILTER_COMMANDS = ['find'];

// Merge `authorizeFilter` to `args.filter`
const getFilter = function ({ authorize, filter }) {
  // If no `args.filter`, no need to merge
  if (filter === undefined) { return authorize; }

  return { type: 'and', value: [authorize, filter] };
};

module.exports = {
  addAuthorizeFilter,
};
