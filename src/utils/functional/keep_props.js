'use strict'

const mimicFn = require('mimic-fn')

// Wraps a functor so it does not modify a function `name`, `length`, etc.
const keepProps = function(functor) {
  return (originalFunc, ...args) => {
    const wrappedFunc = functor(originalFunc, ...args)
    mimicFn(wrappedFunc, originalFunc)
    return wrappedFunc
  }
}

module.exports = {
  keepProps,
}
