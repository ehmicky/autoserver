'use strict'

const opts = {
  type: 'object',
  additionalProperties: false,
  properties: {
    data: {
      type: 'object',
    },
    save: {
      type: 'boolean',
    },
  },
}

module.exports = {
  opts,
}
