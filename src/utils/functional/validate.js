const { throwError } = require('../errors')

const { isObject } = require('./type')

const checkObject = function(obj) {
  if (isObject(obj)) {
    return
  }

  const message = `Utility must be used with objects: '${obj}'`
  throwError(message)
}

module.exports = {
  checkObject,
}
