import filterObj from 'filter-obj'

import { mapKeys, mapValues } from '../../../utils/functional/map.js'
import { transtype } from '../../../utils/transtype.js'

// Returns a request's application-specific HTTP headers, normalized lowercase.
// At the moment, only keeps X-Autoserver-Params header
export const getHeaders = function ({
  specific: {
    req: { headers },
  },
}) {
  const headersA = filterObj(headers, HEADER_NAMES)
  const headersB = mapKeys(headersA, (value, name) =>
    name.replace(ARGS_REGEXP, '$2'),
  )
  const headersC = mapValues(headersB, transtype)
  return headersC
}

// Allowed headers
const HEADER_NAMES = ['x-autoserver-params']

// Remove prefix
const ARGS_REGEXP = /^(x-autoserver-)(.+)$/u
