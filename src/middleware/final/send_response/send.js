import { getReason } from '../../../errors/props.js'
import { DEFAULT_FORMAT, DEFAULT_RAW_FORMAT } from '../../../formats/get.js'

import { compressContent } from './compress.js'
import { serializeContent } from './serialize.js'
import { getContentType } from './types.js'

// Set basic payload headers, then delegate to protocol handler
export const send = async ({
  protocolAdapter,
  content,
  response,
  type,
  format,
  compressResponse,
  rpc,
  topargs,
  error,
}) => {
  const formatA = normalizeFormat({ format })

  const contentType = getContentType({ format: formatA, type })

  const contentA = await serializeContent({
    format: formatA,
    content,
    type,
    topargs,
    error,
  })

  const { content: contentB, compressResponse: compressResponseA } =
    await compressContent({
      content: contentA,
      compressResponse,
      type,
      contentType,
    })

  const reason = getReason(error)

  return protocolAdapter.send({
    content: contentB,
    response,
    type,
    contentType,
    compressResponse: compressResponseA,
    reason,
    rpc,
  })
}

// If `raw` format was used in input, JSON should be used in output
// Also if a wrong format was parsed during protocolInput and added to mInput,
// then an error will be thrown later, but wrong `format` will be used here.
const normalizeFormat = ({ format }) => {
  const isInvalidFormat =
    format === undefined ||
    typeof format === 'string' ||
    format.name === DEFAULT_RAW_FORMAT.name

  if (!isInvalidFormat) {
    return format
  }

  return DEFAULT_FORMAT
}
