import vary from 'vary'

import { DEFAULT_ALGO } from '../../../../compress/get.js'
import { ALGOS } from '../../../../compress/info.js'
import { isType } from '../../../../content_types.js'

import { getLinks } from './link.js'

// Set HTTP-specific headers and status code
export const setHeaders = ({
  specific,
  specific: { res },
  contentType,
  compressResponse,
  content,
  type,
  rpc,
  response: { data = {}, metadata: { duration, pages } = {} } = {},
}) => {
  // Should theoritically be calculated before `args.silent` is applied,
  // to follow HTTP spec for HEAD method.
  // However, when used with other methods, this is incorrect and make some
  // clients crash
  const contentLength = content.byteLength

  const contentEncoding = getContentEncoding({ compressResponse })

  const allow = getAllow({ data })

  const links = getLinks({ pages, specific, rpc })

  const headers = {
    'Content-Type': contentType,
    'Content-Length': contentLength,
    'Accept-Encoding': ACCEPT_ENCODING,
    'Content-Encoding': contentEncoding,
    Allow: allow,
    Link: links,
    'X-Response-Time': duration,
  }
  setAllHeaders(res, headers)

  setVary({ res, type })
}

const ACCEPT_ENCODING = ALGOS.join(', ')

const getContentEncoding = ({ compressResponse: { name } = {} }) => {
  // Means no compression was applied
  if (name === DEFAULT_ALGO.name) {
    return
  }

  return name
}

// On METHOD or COMMAND errors
const getAllow = ({ data: { allowed } }) => {
  if (allowed === undefined) {
    return
  }

  return allowed.join(', ')
}

const setAllHeaders = (res, headers) => {
  Object.entries(headers)
    .filter(([, value]) => value !== undefined)
    .forEach(([name, value]) => {
      res.setHeader(name, value)
    })
}

// `Vary` HTTP header
const setVary = ({ res, type }) => {
  const objectVary = isType(type, 'object') ? OBJECT_VARY_HEADERS : []
  vary(res, [...objectVary, ...VARY_HEADERS])
}

const VARY_HEADERS = [
  'Accept-Encoding',
  'X-HTTP-Method-Override',
  'X-Autoserver-Params',
]

const OBJECT_VARY_HEADERS = ['Content-Type', 'Accept']
