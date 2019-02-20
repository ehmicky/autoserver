'use strict'

// TODO: use util.isDeepStrictEqual() after dropping support for Node 8
const deepEqual = require('fast-deep-equal')

module.exports = {
  isEqual: deepEqual,
}
