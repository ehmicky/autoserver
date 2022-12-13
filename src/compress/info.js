import compressible from 'compressible'

import { getNames } from '../adapters/get.js'

import { COMPRESS_ADAPTERS } from './adapters/main.js'

export const ALGOS = getNames(COMPRESS_ADAPTERS)

// Do not try to compress binary content types
export const shouldCompress = ({ contentType }) => compressible(contentType)
