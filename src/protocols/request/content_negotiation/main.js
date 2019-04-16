import { omit } from '../../../utils/functional/filter.js'

import { getFormat } from './format.js'
import { getCharset } from './charset.js'
import { getCompress } from './compress.js'

// Retrieve format|charset|compress of the response payloads, and
// charset of the request payload
const handleContentNegotiation = function({
  queryvars,
  format,
  charset,
  compressResponse,
  compressRequest,
}) {
  const formatA = getFormat({ queryvars, format })
  const charsetA = getCharset({ queryvars, charset, format: formatA })
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

module.exports = {
  handleContentNegotiation,
}
