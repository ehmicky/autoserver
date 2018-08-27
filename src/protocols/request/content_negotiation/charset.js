'use strict'

const { addGenPbHandler } = require('../../../errors')
const { getCharset, getCharsets } = require('../../../charsets')

// Retrieve charset asked by client for the request and response payload
const getCharsetFunc = function ({ queryvars, charset, format }) {
  // E.g. ?charset query variable or charset in Content-Type HTTP header
  const charsetA = queryvars.charset || charset
  const charsetB = eGetCharset(charsetA, { format })
  return charsetB
}

const getExtra = function (charset) {
  const suggestions = getCharsets()
  return { kind: 'charset', value: [charset], suggestions }
}

const eGetCharset = addGenPbHandler(getCharset, {
  reason: 'RESPONSE_NEGOTIATION',
  extra: getExtra,
})

module.exports = {
  getCharset: getCharsetFunc,
}
