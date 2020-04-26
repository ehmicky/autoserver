import pluralize from 'pluralize'

import { getWordsList } from '../../utils/string.js'

const getMessage = function (type, { kind, value }) {
  if (value === undefined) {
    return
  }

  const kindName = KINDS[kind]
  const kindNameA = pluralize(kindName, value.length)

  const values = getWordsList(value, { op: 'and', quotes: true })

  return `Unsupported ${kindNameA} for the ${type}: ${values}`
}

const KINDS = {
  type: 'type',
  compress: 'compression algorithm',
  charset: 'charset',
  format: 'format',
}

// Extra:
//  - kind 'type|compress|charset|format'
//  - value STR_ARR
//  - suggestions VAL_ARR
export const REQUEST_NEGOTIATION = {
  status: 'CLIENT_ERROR',
  title: 'The request content negotiation failed',
  getMessage: getMessage.bind(undefined, 'request'),
}

// Extra:
//  - kind 'compress|charset|format'
//  - value STR_ARR
//  - suggestions STR_ARR
export const RESPONSE_NEGOTIATION = {
  status: 'CLIENT_ERROR',
  title: 'The response content negotiation failed',
  getMessage: getMessage.bind(undefined, 'response'),
}
