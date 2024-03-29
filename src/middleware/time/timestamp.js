import { startPerf } from '../../perf/measure.js'

// Start the main performance counter, and add request timestamp
export const addTimestamp = () => {
  // Used by other middleware
  const timestamp = new Date().toISOString()

  // Calculate how long the whole request takes
  const reqPerf = startPerf('request')

  return { timestamp, reqPerf }
}
