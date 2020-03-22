import { getLimits } from '../../../limits.js'

// Whether this is offset pagination (args.page)
// or cursor pagination (args.after|before)
export const isOffset = function ({ args: { page } }) {
  return page !== undefined
}

export const getPagesize = function ({ config, args: { pagesize } }) {
  if (pagesize === undefined) {
    return getLimits({ config }).pagesize
  }

  return pagesize
}

// We try to fetch the models before and after the current batch in order to
// guess has_prev_page and has_next_page
// If hasToken is false, it means we know we are at the beginning or end.
export const getLimit = function ({ config, args }) {
  const pagesize = getPagesize({ config, args })
  return pagesize + 1
}

export const getRightToken = function ({ tokens }) {
  return tokens.after === undefined ? tokens.before : tokens.after
}

// Used for cursor pagination.
export const hasToken = function ({ args }) {
  const token = getRightToken({ tokens: args })
  return token !== undefined && token !== BOUNDARY_TOKEN
}

// When iterating over cursors, those arguments must remain the same
export const SAME_ARGS = ['order', 'filter']

// Cursor tokens argument names
export const TOKEN_NAMES = ['before', 'after']

// Used to signify first|last batch
export const BOUNDARY_TOKEN = ''
