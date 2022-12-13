import { throwError } from '../errors.js'

// Enforces that a function is only called once
export const once = (func, { error = false } = {}) => {
  // eslint-disable-next-line fp/no-let
  let called = false

  return (...args) => {
    if (called) {
      return alreadyCalled({ error })
    }

    // eslint-disable-next-line fp/no-mutation
    called = true
    return func(...args)
  }
}

const alreadyCalled = ({ error }) => {
  if (error) {
    throwError('This function can only be called once')
  }
}
