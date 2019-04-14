'use strict'

const { addGenPbHandler } = require('../../../errors/handler.js')
const {
  DEFAULT_FORMAT,
  getFormat,
  getMimes,
} = require('../../../formats/get.js')

// Retrieve format asked by client for the response payload
const getFormatFunc = function({ queryvars, format }) {
  const formatA = getFormatName({ queryvars, format })

  if (formatA === undefined) {
    return
  }

  const formatB = eGetFormat(formatA, { safe: true })
  return formatB
}

const getFormatName = function({ queryvars, format }) {
  // ?format query variable
  return (
    queryvars.format ||
    // E.g. MIME in Content-Type HTTP header
    format ||
    DEFAULT_FORMAT.name
  )
}

const getExtra = function(format) {
  const suggestions = getMimes({ safe: true })
  return { kind: 'format', value: [format], suggestions }
}

const eGetFormat = addGenPbHandler(getFormat, {
  reason: 'RESPONSE_NEGOTIATION',
  extra: getExtra,
})

module.exports = {
  getFormat: getFormatFunc,
}
