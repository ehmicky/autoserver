'use strict'

const opts = {
  type: 'object',
  additionalProperties: false,
  required: ['report'],
  properties: {
    report: {
      typeof: 'function',
    },
  },
}

module.exports = {
  opts,
}
