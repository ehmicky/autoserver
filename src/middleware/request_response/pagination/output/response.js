import { isOnlyForwardCursor } from '../condition.js'
import { getLimit, hasToken, isOffset } from '../info.js'

import { getMetadata } from './metadata.js'

// Add response metadata related to pagination:
//   token, pagesize, has_prev_page, has_next_page
// Also removes the extra model fetched to guess has_next_page
export const getPaginationOutput = ({
  top,
  args,
  topargs,
  config,
  response,
}) => {
  const hasPrevPage = getHasPrevPage({ args, top })
  const hasNextPage = getHasNextPage({ args, config, response })

  const data = getData({ response, hasNextPage })

  const pagesize = data.length

  const metadata = getMetadata({
    top,
    args,
    topargs,
    data,
    hasPrevPage,
    hasNextPage,
  })

  const pages = { pagesize, ...metadata }
  return { data, metadata: { ...response.metadata, pages } }
}

const getHasPrevPage = ({ args, args: { page }, top }) => {
  if (isOffset({ args })) {
    return page !== 1
  }

  // If a token (except BOUNDARY_TOKEN) has been used,
  // it means there is a previous page
  return hasToken({ args }) && !isOnlyForwardCursor({ top })
}

// We fetch an extra model to guess has_next_page. If it was founds, remove it
const getHasNextPage = ({ args, config, response }) => {
  const limit = getLimit({ args, config })
  return response.data.length === limit
}

const getData = ({ response: { data }, hasNextPage }) => {
  if (!hasNextPage) {
    return data
  }

  return data.slice(0, -1)
}
