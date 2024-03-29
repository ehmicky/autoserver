// Merge `coll.authorize` `model.*` to `args.filter`
export const addAuthorizeFilter = ({
  command,
  authorize,
  args,
  args: { filter },
}) => {
  // `coll.authorize` is merged `args.filter` only for `find` commands since
  // other commands do not have `args.filter`.
  // However, all write commands first fire `currentData` `find` actions,
  // which means `model.*` authorization is checked for write actions then
  // as well.
  if (!FILTER_COMMANDS.has(command)) {
    return args
  }

  const filterA = getFilter({ authorize, filter })
  // If `filter` is undefined, we need a way to know `preFilter` was
  // set
  const preFilter = filter || {}
  // Keep current `args.filter` as `args.preFilter`
  const argsA = { ...args, filter: filterA, preFilter }

  return argsA
}

const FILTER_COMMANDS = new Set(['find'])

// Merge `authorizeFilter` to `args.filter`
const getFilter = ({ authorize, filter }) => {
  // If no `args.filter`, no need to merge
  if (filter === undefined) {
    return authorize
  }

  return { type: '_and', value: [authorize, filter] }
}
