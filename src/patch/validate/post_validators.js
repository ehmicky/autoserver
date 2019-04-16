import { checkEmpty } from './types/empty.js'
import { applyCheck } from './check.js'

// Apply validation after model.ATTR has been resolved
const POST_VALIDATORS = [checkEmpty, applyCheck]

module.exports = {
  POST_VALIDATORS,
}
