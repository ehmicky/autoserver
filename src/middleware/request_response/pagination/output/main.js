import { getBackwardResponse } from '../backward.js'
import { willPaginate } from '../condition.js'

import { getPaginationOutput } from './response.js'

// Add response metadata related to pagination
export const handlePaginationOutput = function ({
  top,
  args,
  topargs,
  config,
  response,
  ...rest
}) {
  if (!willPaginate({ top, args, config, ...rest })) {
    return
  }

  const responseA = getPaginationOutput({
    top,
    args,
    topargs,
    config,
    response,
  })

  const responseB = getBackwardResponse({ args, response: responseA })

  return { response: responseB }
}
