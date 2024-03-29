import { logPerfEvent } from '../log/perf.js'
import { startPerf, stopPerf } from '../perf/measure.js'

// Monitor startup time
export const startStartupPerf = () => {
  const startupPerf = startPerf('startup')
  return { startupPerf }
}

export const stopStartupPerf = ({ startupPerf, measures }) => {
  const startupPerfA = stopPerf(startupPerf)
  const measuresA = [startupPerfA, ...measures]
  return { measures: measuresA }
}

// Emit "perf" event with startup performance
export const reportStartupPerf = ({ config, measures }) =>
  logPerfEvent({ phase: 'startup', config, measures })
