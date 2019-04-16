import { getSumParams } from '../../utils/sums.js'
import { addGenPbHandler, addErrorHandler } from '../../errors/handler.js'
import { throwPb } from '../../errors/props.js'
import { getLimits } from '../../limits.js'

import { validateBoolean } from './validate.js'

// Fill in `mInput.payload` using protocol-specific request payload.
// Are set in a protocol-agnostic format, i.e. each protocol sets the same
// object.
// Meant to be used by rpc layer, e.g. to populate `mInput.args`
const parsePayload = function({
  protocolAdapter,
  specific,
  config,
  charset,
  format,
  compressRequest,
}) {
  const hasPayload = protocolAdapter.hasPayload({ specific })
  validateBoolean(hasPayload, 'hasPayload', protocolAdapter)

  if (!hasPayload) {
    return
  }

  return parseRawPayload({
    specific,
    protocolAdapter,
    config,
    format,
    charset,
    compressRequest,
  })
}

const parseRawPayload = async function({
  specific,
  protocolAdapter: { getPayload },
  config,
  format,
  charset,
  compressRequest,
}) {
  const { maxpayload } = getLimits({ config })
  // Use protocol-specific way to parse payload, using a known type
  const payload = await getPayload({ specific, maxpayload })

  const payloadA = await eDecompressPayload({ compressRequest, payload })

  const payloadB = eDecodeCharset({ content: payloadA, charset })

  const payloadC = eParseContent({ payload: payloadB, format })

  // `payloadsize` and `payloadcount` parameters
  const sumParams = getSumParams({ attrName: 'payload', value: payloadC })

  return { payload: payloadC, ...sumParams }
}

// Request body decompression
const decompressPayload = function({ compressRequest, payload }) {
  return compressRequest.decompress(payload)
}

const eDecompressPayload = addGenPbHandler(decompressPayload, {
  reason: 'REQUEST_NEGOTIATION',
  message: ({ compressRequest: { title } }) =>
    `The request payload could not be decompressed using ${title}`,
  extra: { kind: 'compress' },
})

const decodeCharset = function({ content, charset }) {
  return charset.decode(content)
}

const eDecodeCharset = addGenPbHandler(decodeCharset, {
  reason: 'REQUEST_NEGOTIATION',
  message: ({ charset }) =>
    `The request payload could not be decoded using the charset '${
      charset.name
    }'`,
  extra: { kind: 'charset' },
})

// Parse content, e.g. JSON/YAML parsing
const parseContent = function({ format, payload }) {
  return format.parseContent(payload)
}

const parseContentHandler = function(error, { payload, format }) {
  const { message, kind } = getContentErrorProps({ payload, format })

  throwPb({
    reason: 'REQUEST_NEGOTIATION',
    message,
    extra: { kind },
    innererror: error,
  })
}

const getContentErrorProps = function({ payload, format: { title } }) {
  if (!payload) {
    return { message: 'The request payload is empty', kind: 'type' }
  }

  return { message: `The request payload is invalid ${title}`, kind: 'format' }
}

const eParseContent = addErrorHandler(parseContent, parseContentHandler)

module.exports = {
  parsePayload,
}
