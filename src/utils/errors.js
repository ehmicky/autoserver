'use strict'

// We want to enforce using throwError() when throwing exception
// Therefore, we have ESLint rule no-throw enabled.
// However, utils cannot use normal throwError() without circular
// dependencies
// ESLint rule fp/no-throw helps enforcing this utility is used
const throwError = function(message) {
  if (message instanceof Error) {
    throw message
  }

  throw new Error(message)
}

module.exports = {
  throwError,
}
