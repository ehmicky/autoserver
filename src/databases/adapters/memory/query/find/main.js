import { evalFilter } from '../../../../../filter/eval.js'

import { limitResponse } from './limit.js'
import { offsetResponse } from './offset.js'
import { sortResponse } from './order.js'

// Retrieve models
export const find = ({ collection, filter, order, offset, limit }) => {
  const data = collection.filter((model) =>
    evalFilter({ attrs: model, filter }),
  )

  const dataA = sortResponse({ data, order })
  const dataB = offsetResponse({ data: dataA, offset })
  const dataC = limitResponse({ data: dataB, limit })

  return dataC
}
