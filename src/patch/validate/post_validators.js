import { checkEmpty } from './types/empty.js'
import { applyCheck } from './check.js'

// Apply validation after model.ATTR has been resolved
export const POST_VALIDATORS = [checkEmpty, applyCheck]
