'use strict'

// Wraps a functor so it does not modify a function `name`, `length`, etc.
const keepProps = function(functor) {
  return (originalFunc, ...args) => {
    const wrappedFunc = functor(originalFunc, ...args)

    copyProperties({ originalFunc, wrappedFunc })

    return wrappedFunc
  }
}

const copyProperties = function({ originalFunc, wrappedFunc }) {
  Reflect.ownKeys(originalFunc).forEach(propName =>
    copyProperty({ originalFunc, wrappedFunc, propName }),
  )
}

const copyProperty = function({ originalFunc, wrappedFunc, propName }) {
  const prop = Object.getOwnPropertyDescriptor(originalFunc, propName)
  // eslint-disable-next-line fp/no-mutating-methods
  Object.defineProperty(wrappedFunc, propName, prop)
}

module.exports = {
  keepProps,
}
