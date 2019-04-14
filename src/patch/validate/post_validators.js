'use strict'

const { checkEmpty } = require('./types/empty.js')
const { applyCheck } = require('./check')

// Apply validation after model.ATTR has been resolved
const POST_VALIDATORS = [checkEmpty, applyCheck]

module.exports = {
  POST_VALIDATORS,
}
