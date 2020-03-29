import { DEFAULT_ALGO } from '../../../compress/get.js'
import { shouldCompress } from '../../../compress/info.js'

import { TYPES } from './types.js'

// Response body compression
export const compressContent = async function ({
  content,
  compressResponse,
  type,
  contentType,
}) {
  const algo = getAlgo({ compressResponse, type, contentType })

  const contentA = await algo.compress(content)

  return { content: contentA, compressResponse: algo }
}

const getAlgo = function ({ compressResponse, type, contentType }) {
  const isInvalid =
    compressResponse === undefined ||
    typeof compressResponse === 'string' ||
    !willCompress({ type, contentType })

  if (isInvalid) {
    return DEFAULT_ALGO
  }

  return compressResponse
}

const willCompress = function ({ type, contentType }) {
  return TYPES[type].isText || shouldCompress({ contentType })
}
