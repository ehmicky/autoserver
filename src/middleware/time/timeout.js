'use strict'

const { throwPb } = require('../../errors')
const { pSetTimeout } = require('../../utils')
const { getLimits } = require('../../limits')

// Make request fail after some timeout
const setRequestTimeout = function({ mInput, config }, nextLayer) {
  const timeoutPromise = startRequestTimeout({ config })
  const nextLayerPromise = nextLayer(mInput, 'protocol')

  return Promise.race([timeoutPromise, nextLayerPromise])
}

const startRequestTimeout = async function({ config, config: { env } }) {
  const { requestTimeout } = getLimits({ config })
  // When debugging with breakpoints, we do not want any request timeout
  const timeout = env === 'dev' ? HUGE_TIMEOUT : requestTimeout

  // Note that the timeout is a minimum, since it will only be fired at the
  // beginning of a new macrotask
  await pSetTimeout(timeout)

  throwPb({
    reason: 'TIMEOUT',
    extra: { limit: timeout },
  })
}

const HUGE_TIMEOUT = 1e9

module.exports = {
  setRequestTimeout,
}
