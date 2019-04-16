import parsePreferHeaderLib from 'parse-prefer-header'

import { omitBy } from '../../../utils/functional/filter.js'
import { mapValues } from '../../../utils/functional/map.js'
import { addGenErrorHandler } from '../../../errors/handler.js'
import { throwError } from '../../../errors/main.js'

import { getFormat } from './content_negotiation/format.js'
import { getCharset } from './content_negotiation/charset.js'
import {
  getCompressResponse,
  getCompressRequest,
} from './content_negotiation/compress.js'
import { getAgnosticMethod } from './method.js'

// HTTP-specific ways to set input
const mapInput = function(methods, ...args) {
  const input = mapValues(methods, func => func(...args))
  const inputA = omitBy(input, value => value === undefined)
  return inputA
}

// Using `X-HTTP-Method-Override` changes the method
const getMethod = function({
  specific: {
    req: { headers },
  },
  method,
}) {
  const methodOverride = headers['x-http-method-override']

  if (!methodOverride) {
    return
  }

  if (method === 'POST') {
    return getAgnosticMethod({ method: methodOverride })
  }

  const message = `The HTTP header 'X-HTTP-Method-Override' must be used with the HTTP method POST, not ${method}`
  throwError(message, { reason: 'VALIDATION' })
}

// Using `Prefer: return=minimal` request header results in `args.silent` true.
// Same thing for `HEAD` method
const getSilent = function({ specific, method }) {
  if (method === 'HEAD') {
    return true
  }

  const preferHeader = eParsePreferHeader({ specific })
  const hasMinimalPreference = preferHeader.return === 'minimal'

  if (hasMinimalPreference) {
    return true
  }
}

// Parses Prefer HTTP header
const parsePreferHeader = function({
  specific: {
    req: {
      headers: { prefer },
    },
  },
}) {
  if (!prefer) {
    return {}
  }

  return parsePreferHeaderLib(prefer)
}

const eParsePreferHeader = addGenErrorHandler(parsePreferHeader, {
  message: ({ prefer }) =>
    `HTTP 'Prefer' header value syntax error: '${prefer}'`,
  reason: 'VALIDATION',
})

const TOPARGS_INPUT = {
  silent: getSilent,
}
const getTopargs = mapInput.bind(null, TOPARGS_INPUT)

const INPUT = {
  method: getMethod,
  topargs: getTopargs,
  format: getFormat,
  charset: getCharset,
  compressResponse: getCompressResponse,
  compressRequest: getCompressRequest,
}
const getInput = mapInput.bind(null, INPUT)

module.exports = {
  getInput,
}
