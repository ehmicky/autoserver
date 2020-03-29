import { throwPb } from '../../errors/props.js'
import { getLimits } from '../../limits.js'
import { setWeakTimeout } from '../../utils/timeout.js'

// Make request fail after some timeout
export const setRequestTimeout = function ({ mInput, config }, nextLayer) {
  const timeoutPromise = startRequestTimeout({ config })
  const nextLayerPromise = nextLayer(mInput, 'protocol')

  return Promise.race([timeoutPromise, nextLayerPromise])
}

const startRequestTimeout = async function ({ config, config: { env } }) {
  const { requestTimeout } = getLimits({ config })
  // When debugging with breakpoints, we do not want any request timeout
  const timeout = env === 'dev' ? HUGE_TIMEOUT : requestTimeout

  // Note that the timeout is a minimum, since it will only be fired at the
  // beginning of a new macrotask
  await setWeakTimeout(timeout)

  throwPb({
    reason: 'TIMEOUT',
    extra: { limit: timeout },
  })
}

const HUGE_TIMEOUT = 1e9
