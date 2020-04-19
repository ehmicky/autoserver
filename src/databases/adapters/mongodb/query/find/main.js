import { limitResponse } from './limit.js'
import { offsetResponse } from './offset.js'
import { getQueryFilter } from './operators.js'
import { sortResponse } from './order.js'

// Find models
export const find = function (input) {
  const { filterIds } = input
  const func = filterIds && filterIds.length === 1 ? findOne : findMany
  return func(input)
}

const findOne = async function ({ collection, filterIds }) {
  const model = await collection.findOne({ _id: filterIds[0] })
  return model === undefined || model === null ? [] : [model]
}

const findMany = function ({ collection, filter, offset, limit, order }) {
  const queryFilter = getQueryFilter(filter)
  const cursor = collection.find(queryFilter)

  const cursorA = limitResponse({ cursor, limit })
  const cursorB = offsetResponse({ cursor: cursorA, offset })
  const cursorC = sortResponse({ cursor: cursorB, order })

  return cursorC.toArray()
}
