import compressible from 'compressible'

import { getNames } from '../adapters/get.js'

import { COMPRESS_ADAPTERS } from './adapters/main.js'

const ALGOS = getNames(COMPRESS_ADAPTERS)

// Do not try to compress binary content types
const shouldCompress = function({ contentType }) {
  return compressible(contentType)
}

module.exports = {
  ALGOS,
  shouldCompress,
}
