import { evalFilter } from '../../../../../filter/eval.js'

import { sortResponse } from './order.js'
import { offsetResponse } from './offset.js'
import { limitResponse } from './limit.js'

// Retrieve models
const find = function({ collection, filter, order, offset, limit }) {
  const data = collection.filter(model => evalFilter({ attrs: model, filter }))

  const dataA = sortResponse({ data, order })
  const dataB = offsetResponse({ data: dataA, offset })
  const dataC = limitResponse({ data: dataB, limit })

  return dataC
}

module.exports = {
  find,
}
