import { getBackwardOrder } from '../backward.js'
import { isOffset, getLimit } from '../info.js'

import { getTokenFilter } from './filter.js'

// Transform args.pagesize|before|after|page into args.limit|offset|filter
export const getPaginationInput = function ({ args, token, config }) {
  const argsA = getInput({ args, token, config })
  const argsB = { ...args, ...argsA }
  return argsB
}

const getInput = function ({ args, token, config }) {
  if (isOffset({ args })) {
    return getOffsetInput({ args, config })
  }

  return getTokensInput({ args, token, config })
}

const getOffsetInput = function ({ args, args: { page }, config }) {
  const limit = getLimit({ args, config })
  const offset = (page - 1) * (limit - 1)

  return { limit, offset }
}

const getTokensInput = function ({ args, token, config }) {
  const tokenInput = getTokenFilter({ args, token })
  const order = getBackwardOrder({ args })
  const limit = getLimit({ args, config })
  return { ...tokenInput, ...order, limit }
}
