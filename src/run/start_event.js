import omit from 'omit.js'

import { mapValues } from '../utils/functional/map.js'
import { pSetTimeout } from '../utils/timeout.js'
import { logEvent } from '../log/main.js'
import { getDefaultDuration } from '../perf/measure.js'
import { getServerinfo } from '../serverinfo/main.js'

// Create event when all protocol-specific servers have started
export const emitStartEvent = async function ({
  protocolAdapters,
  config,
  measures,
}) {
  // Let other events finish first
  await pSetTimeout(0)

  const message = 'Server is ready'
  const params = getEventParams({ protocolAdapters, config, measures })
  await logEvent({ event: 'start', phase: 'startup', message, params, config })

  const startPayload = getStartPayload({ params, config })

  return { startPayload }
}

// Remove some properties from event payload as they are not serializable,
// or should not be made immutable
const getEventParams = function ({ protocolAdapters, measures }) {
  const protocols = mapValues(protocolAdapters, ({ info }) =>
    omit(info, ['server']),
  )

  const duration = getDefaultDuration({ measures })

  return { protocols, duration }
}

const getStartPayload = function ({ params: { protocols }, config }) {
  const serverinfo = getServerinfo({ config })

  return { protocols, serverinfo }
}
