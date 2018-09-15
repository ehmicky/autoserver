'use strict'

const { throwPb } = require('../../../errors')

const { TYPES } = require('./types')

const validateResponse = function({ response: { type, content } }) {
  if (!type) {
    const message = 'Server sent an response with no content type'
    throwPb({ message, reason: 'ENGINE' })
  }

  if (content === undefined) {
    const message = 'Server sent an empty response'
    throwPb({ message, reason: 'ENGINE' })
  }

  if (TYPES[type] === undefined) {
    const message = 'Server tried to respond with an unsupported content type'
    throwPb({ message, reason: 'ENGINE' })
  }
}

module.exports = {
  validateResponse,
}
