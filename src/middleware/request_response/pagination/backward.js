import { reverseArray } from '../../../utils/functional/reverse.js'

// When using args.before, reverse args.filter on input
export const getBackwardFilter = ({ args, node, node: { type } }) => {
  if (!isBackward({ args })) {
    return node
  }

  const typeA = type === '_gt' ? '_lt' : '_gt'
  return { ...node, type: typeA }
}

// When using args.before, reverse args.order on input
export const getBackwardOrder = ({ args, args: { order } }) => {
  if (!isBackward({ args })) {
    return
  }

  const orderA = order.map(({ attrName, dir }) => ({
    attrName,
    dir: dir === 'asc' ? 'desc' : 'asc',
  }))
  return { order: orderA }
}

// When using args.before, reverse both output and metadata on output.
export const getBackwardResponse = ({
  args,
  response,
  response: {
    data,
    metadata,
    metadata: { pages },
  },
}) => {
  if (!isBackward({ args })) {
    return response
  }

  const dataA = reverseArray(data)

  const pagesA = {
    ...pages,
    has_prev_page: pages.has_next_page,
    has_next_page: pages.has_prev_page,
    prev_token: pages.next_token,
    next_token: pages.prev_token,
    first_token: pages.last_token,
    last_token: pages.first_token,
  }

  return {
    ...response,
    data: dataA,
    metadata: { ...metadata, pages: pagesA },
  }
}

const isBackward = ({ args }) => args.before !== undefined
