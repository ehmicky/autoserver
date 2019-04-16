import { brotli } from './brotli.js'
import { deflate } from './deflate.js'
import { gzip } from './gzip.js'
import { identity } from './identity.js'

// Order matters, as first ones will have priority
export const COMPRESS_ADAPTERS = [
  ...(brotli.supported ? [brotli] : []),
  deflate,
  gzip,
  identity,
]
