import { getPagesize } from './info.js'

// Whether request will be paginated
export const willPaginate = ({ args, command, commandpath, top, config }) =>
  commandpath === '' &&
  PAGINATION_TOP_COMMANDS.has(top.command.name) &&
  PAGINATION_COMMANDS.has(command) &&
  !isPaginationDisabled({ config, args })

const PAGINATION_TOP_COMMANDS = new Set(['findMany', 'patchMany'])
const PAGINATION_COMMANDS = new Set(['find'])

// Using args.pagesize 0 or pagesize 0 disables pagination
const isPaginationDisabled = ({ config, args }) => {
  const pagesize = getPagesize({ args, config })
  return pagesize === 0
}

// `patch` commands can only iterate forward, as pagination is here only
// meant for database load controlling, not as a client feature.
// This means:
//  - offset pagination is not available
//  - backward cursor pagination is not available
export const isOnlyForwardCursor = ({ top }) =>
  FORWARD_TOP_COMMANDS.has(top.command.name)

const FORWARD_TOP_COMMANDS = new Set(['patchMany'])
