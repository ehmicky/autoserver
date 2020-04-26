import filterObj from 'filter-obj'

import { addCatchAllPbHandler } from '../errors/handler.js'
import { keyBy } from '../utils/functional/key_by.js'
import { mapValues } from '../utils/functional/map.js'

// Wrap adapters to:
//  - add error handlers to catch adapter bugs
//  - only expose some `members`
//  - add `methods` bound with the adapter as first argument
export const wrapAdapters = function ({
  adapters,
  members = [],
  methods = {},
  reason = 'ADAPTER',
}) {
  const adaptersA = keyBy(adapters)

  return mapValues(adaptersA, (adapter) =>
    wrapAdapter({ adapter, members, methods, reason }),
  )
}

const wrapAdapter = function ({ adapter, members, methods, reason }) {
  const adapterA = addErrorHandlers({ adapter, reason })
  const wrapped = classify({ adapter: adapterA, members, methods })

  // We directly mutate so that methods are bound with `wrapped` parameter
  // eslint-disable-next-line fp/no-mutating-assign
  Object.assign(adapterA, { wrapped })

  return { ...adapter, wrapped }
}

// Adapter functions should never throw
// If they do, it indicates an adapter bug, where we assign specific error
// reasons
// Except if they threw using throwError()
const addErrorHandlers = function ({ adapter, reason }) {
  const methods = filterObj(adapter, isFunction)
  const methodsA = mapValues(methods, (method) =>
    addCatchAllPbHandler(method, {
      reason,
      extra: { adapter: adapter.name },
    }),
  )
  const adapterA = { ...adapter, ...methodsA }
  return adapterA
}

const isFunction = function (key, value) {
  return typeof value === 'function'
}

// Similar to create a new class, but more functional programming-oriented
const classify = function ({ adapter, members, methods }) {
  const membersA = filterObj(adapter, members)
  const methodsA = mapValues(methods, (method) =>
    method.bind(undefined, adapter),
  )
  return { ...membersA, ...methodsA }
}
