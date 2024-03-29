import { getCharset, getCharsets } from '../../../charsets/main.js'
import { addGenPbHandler } from '../../../errors/handler.js'

// Retrieve charset asked by client for the request and response payload
export const getCharsetFunc = ({ queryvars, charset, format }) => {
  // E.g. ?charset query variable or charset in Content-Type HTTP header
  const charsetA = queryvars.charset || charset
  const charsetB = eGetCharset(charsetA, { format })
  return charsetB
}

const getExtra = (charset) => {
  const suggestions = getCharsets()
  return { kind: 'charset', value: [charset], suggestions }
}

const eGetCharset = addGenPbHandler(getCharset, {
  reason: 'RESPONSE_NEGOTIATION',
  extra: getExtra,
})
