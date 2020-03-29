import omit from 'omit.js'

import { getCharsetFunc } from './charset.js'
import { getCompress } from './compress.js'
import { getFormatFunc } from './format.js'

// Retrieve format|charset|compress of the response payloads, and
// charset of the request payload
export const handleContentNegotiation = function ({
  queryvars,
  format,
  charset,
  compressResponse,
  compressRequest,
}) {
  const formatA = getFormatFunc({ queryvars, format })
  const charsetA = getCharsetFunc({ queryvars, charset, format: formatA })
  const {
    compressResponse: compressResponseA,
    compressRequest: compressRequestA,
    compress: compressA,
  } = getCompress({ queryvars, compressResponse, compressRequest })

  const queryvarsA = omit(queryvars, ['format', 'charset', 'compress'])

  return {
    queryvars: queryvarsA,
    format: formatA,
    charset: charsetA,
    compressResponse: compressResponseA,
    compressRequest: compressRequestA,
    compress: compressA,
  }
}
