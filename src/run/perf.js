import { startPerf, stopPerf } from '../perf/measure.js'
import { logPerfEvent } from '../log/perf.js'

// Monitor startup time
export const startStartupPerf = function () {
  const startupPerf = startPerf('startup')
  return { startupPerf }
}

export const stopStartupPerf = function ({ startupPerf, measures }) {
  const startupPerfA = stopPerf(startupPerf)
  const measuresA = [startupPerfA, ...measures]
  return { measures: measuresA }
}

// Emit "perf" event with startup performance
export const reportStartupPerf = function ({ config, measures }) {
  return logPerfEvent({ phase: 'startup', config, measures })
}
