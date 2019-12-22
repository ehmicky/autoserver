import { logEvent } from '../../log/main.js'
import { nanoSecsToMilliSecs } from '../../perf/measure.js'

// Main "call" event middleware.
// Each request creates exactly one "call" event, whether successful or not
export const callEvent = function({
  config,
  level,
  mInput,
  error,
  respPerf: { duration } = {},
}) {
  const durationA = nanoSecsToMilliSecs(duration)

  return logEvent({
    mInput,
    event: 'call',
    phase: 'request',
    level,
    params: { error, duration: durationA },
    config,
  })
}
