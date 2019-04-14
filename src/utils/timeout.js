'use strict'

const { promisify } = require('util')

const pSetTimeout = promisify(setTimeout)

// Like promisify(setTimeout), except does not keep server alive because of a
// hanging timeout, e.g. used in request timeout
const setWeakTimeout = function(delay) {
  // eslint-disable-next-line promise/avoid-new
  return new Promise(resolve => {
    const id = setTimeout(resolve, delay)
    id.unref()
  })
}

module.exports = {
  pSetTimeout,
  setWeakTimeout,
}
