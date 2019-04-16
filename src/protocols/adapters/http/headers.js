import { pickBy } from '../../../utils/functional/filter.js'
import { mapKeys, mapValues } from '../../../utils/functional/map.js'
import { transtype } from '../../../utils/transtype.js'

// Returns a request's application-specific HTTP headers, normalized lowercase.
// At the moment, only keeps X-Autoserver-Params header
const getHeaders = function({
  specific: {
    req: { headers },
  },
}) {
  const headersA = pickBy(headers, (value, name) => HEADER_NAMES.includes(name))
  const headersB = mapKeys(headersA, (value, name) =>
    name.replace(ARGS_REGEXP, '$2'),
  )
  const headersC = mapValues(headersB, transtype)
  return headersC
}

// Whitelisted headers
const HEADER_NAMES = ['x-autoserver-params']

// Remove prefix
const ARGS_REGEXP = /^(x-autoserver-)(.+)$/u

module.exports = {
  getHeaders,
}
